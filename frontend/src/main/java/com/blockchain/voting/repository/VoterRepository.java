package com.blockchain.voting.repository;
import com.blockchain.voting.model.AuditLog;
import com.blockchain.voting.model.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoterRepository extends JpaRepository<Voter, Long> {
    Optional<Voter> findByVoterId(String voterId);
}