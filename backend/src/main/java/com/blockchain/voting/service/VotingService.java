package com.blockchain.voting.service;
import com.blockchain.voting.model.*;
import com.blockchain.voting.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.*;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.tx.FastRawTransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class VotingService {

    private final Web3j web3j;
    @Autowired private VoterRepository voterRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    @Value("${contract.address}") private String contractAddress;
    @Value("${blockchain.private.key}") private String privateKey;

    public VotingService(Web3j web3j) { this.web3j = web3j; }

    public Voter authenticate(String voterId, String rawPassword) {
        Voter voter = voterRepository.findByVoterId(voterId)
                .orElseThrow(() -> new RuntimeException("Voter not found"));
        if (!passwordEncoder.matches(rawPassword, voter.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return voter;
    }

    @Transactional(rollbackFor = Exception.class)
public String castVoteAndLog(VoteRequest request) throws Exception {
    Voter voter = voterRepository.findByVoterId(request.getVoterId())
            .orElseThrow(() -> new RuntimeException("Voter not registered"));

    if (voter.isHasVoted()) {
        throw new RuntimeException("This ID has already voted.");
    }

    
    voter.setHasVoted(true);
    voterRepository.save(voter);

    AuditLog log = new AuditLog();
    log.setTransactionHash(request.getTxHash());
    log.setCandidateId(request.getCandidateId());
    log.setVoterId(request.getVoterId());
    auditLogRepository.save(log);

    return request.getTxHash();
}

    public String getVotesFromBlockchain(int candidateId) throws Exception {
        Function function = new Function("getVotes",
                Arrays.asList(new Uint(BigInteger.valueOf(candidateId))),
                Arrays.asList(new TypeReference<Uint>() {}));
        
        EthCall response = web3j.ethCall(
                Transaction.createEthCallTransaction(null, contractAddress, FunctionEncoder.encode(function)),
                DefaultBlockParameterName.LATEST).send();
        
        List<Type> results = FunctionReturnDecoder.decode(response.getValue(), function.getOutputParameters());
        return results.isEmpty() ? "0" : results.get(0).getValue().toString();
    }
}