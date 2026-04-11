package com.blockchain.voting.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionHash;
    private Integer candidateId;
    private String voterId;
    private LocalDateTime timestamp = LocalDateTime.now();
}