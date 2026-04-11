package com.blockchain.voting.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "voters")
@Data
public class Voter {


    public Voter() {
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String voterId;

    @Column(nullable = false)
    private String password;

    private boolean hasVoted = false;

    private String walletAddress;
}