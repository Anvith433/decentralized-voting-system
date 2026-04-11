package com.blockchain.voting.controller;

import com.blockchain.voting.model.*;
import com.blockchain.voting.service.VotingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/voting")
@CrossOrigin(origins = "http://localhost:5173")
public class VotingController {

    @Autowired private VotingService votingService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            Voter voter = votingService.authenticate(body.get("voterId"), body.get("password"));
            return ResponseEntity.ok(voter);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@RequestBody VoteRequest request) {
        try {
            String hash = votingService.castVoteAndLog(request);
            return ResponseEntity.ok(Map.of("hash", hash));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<?> getResults(@PathVariable int id) throws Exception {
        return ResponseEntity.ok(votingService.getVotesFromBlockchain(id));
    }
}