package com.blockchain.voting.model;

public class VoteRequest {
    private int candidateId;
    private String voterId;
    private String txHash;
    

    public int getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(int candidateId) {
        this.candidateId = candidateId;
    }

    public String getVoterId() {
        return voterId;
    }

    public void setVoterId(String voterId) {
        this.voterId = voterId;
    }
    public String getTxHash() {
        return txHash;
    }
    public void setTxHash(String txHash) {
        this.txHash = txHash;
    }
}
    