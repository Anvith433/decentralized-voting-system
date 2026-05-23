const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureVoting Contract", function () {
  let secureVoting;
  let owner;
  let voter1, voter2, voter3;
  const VOTER_ID_HASH = "0x123456789abcdef";

  beforeEach(async function () {
    // Get signers
    [owner, voter1, voter2, voter3] = await ethers.getSigners();

    // Deploy contract
    const SecureVoting = await ethers.getContractFactory("SecureVoting");
    secureVoting = await SecureVoting.deploy(owner.address);
    await secureVoting.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy with correct commissioner", async function () {
      const commissioner = await secureVoting.electionCommissioner();
      expect(commissioner).to.equal(owner.address);
    });

    it("Should initialize with no candidates", async function () {
      const count = await secureVoting.candidateCount();
      expect(count).to.equal(0);
    });

    it("Should initialize with election inactive", async function () {
      const active = await secureVoting.electionActive();
      expect(active).to.equal(false);
    });
  });

  describe("Candidate Registration", function () {
    it("Should register a candidate", async function () {
      await secureVoting.registerCandidate("Alice", "Democratic candidate");
      const candidate = await secureVoting.getCandidate(1);
      expect(candidate.name).to.equal("Alice");
      expect(candidate.description).to.equal("Democratic candidate");
      expect(candidate.voteCount).to.equal(0);
    });

    it("Should reject empty candidate name", async function () {
      await expect(
        secureVoting.registerCandidate("", "Description")
      ).to.be.revertedWith("Candidate name cannot be empty");
    });

    it("Should reject non-commissioner registration", async function () {
      await expect(
        secureVoting
          .connect(voter1)
          .registerCandidate("Bob", "Republican candidate")
      ).to.be.revertedWith("Only election commissioner can call this");
    });

    it("Should register multiple candidates", async function () {
      await secureVoting.registerCandidate("Alice", "Democratic candidate");
      await secureVoting.registerCandidate("Bob", "Republican candidate");
      await secureVoting.registerCandidate("Charlie", "Independent candidate");

      const count = await secureVoting.candidateCount();
      expect(count).to.equal(3);
    });
  });

  describe("Voter Registration", function () {
    it("Should register a voter", async function () {
      await secureVoting.registerVoter(voter1.address, VOTER_ID_HASH);
      const [isRegistered, hasVoted] = await secureVoting.getVoterStatus(
        voter1.address
      );
      expect(isRegistered).to.equal(true);
      expect(hasVoted).to.equal(false);
    });

    it("Should prevent duplicate voter registration", async function () {
      await secureVoting.registerVoter(voter1.address, VOTER_ID_HASH);
      await expect(
        secureVoting.registerVoter(voter1.address, VOTER_ID_HASH)
      ).to.be.revertedWith("Voter already registered");
    });

    it("Should reject non-commissioner registration", async function () {
      await expect(
        secureVoting
          .connect(voter1)
          .registerVoter(voter2.address, VOTER_ID_HASH)
      ).to.be.revertedWith("Only election commissioner can call this");
    });

    it("Should register multiple voters", async function () {
      const voters = [voter1.address, voter2.address, voter3.address];
      await secureVoting.registerMultipleVoters(voters);

      const count = await secureVoting.registeredVoters();
      expect(count).to.equal(3);
    });
  });

  describe("Election Management", function () {
    beforeEach(async function () {
      // Register candidates
      await secureVoting.registerCandidate("Alice", "Democratic");
      await secureVoting.registerCandidate("Bob", "Republican");

      // Register voters
      await secureVoting.registerVoter(voter1.address, VOTER_ID_HASH);
      await secureVoting.registerVoter(voter2.address, VOTER_ID_HASH);
    });

    it("Should start election", async function () {
      await secureVoting.startElection(1);
      const active = await secureVoting.electionActive();
      expect(active).to.equal(true);
    });

    it("Should prevent start without candidates", async function () {
      const SecureVoting = await ethers.getContractFactory("SecureVoting");
      const voting = await SecureVoting.deploy(owner.address);
      await voting.waitForDeployment();

      await voting.registerVoter(voter1.address, VOTER_ID_HASH);

      await expect(voting.startElection(1)).to.be.revertedWith(
        "No candidates registered"
      );
    });

    it("Should end election", async function () {
      await secureVoting.startElection(1);
      await secureVoting.endElection();
      const active = await secureVoting.electionActive();
      expect(active).to.equal(false);
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Register candidates
      await secureVoting.registerCandidate("Alice", "Candidate A");
      await secureVoting.registerCandidate("Bob", "Candidate B");

      // Register voters
      await secureVoting.registerVoter(voter1.address, VOTER_ID_HASH);
      await secureVoting.registerVoter(voter2.address, VOTER_ID_HASH);
      await secureVoting.registerVoter(voter3.address, VOTER_ID_HASH);

      // Start election
      await secureVoting.startElection(1);
    });

    it("Should cast a vote", async function () {
      await secureVoting.connect(voter1).vote(1);

      const [isRegistered, hasVoted] = await secureVoting.getVoterStatus(
        voter1.address
      );
      expect(hasVoted).to.equal(true);

      const candidate = await secureVoting.getCandidate(1);
      expect(candidate.voteCount).to.equal(1);
    });

    it("Should prevent double voting", async function () {
      await secureVoting.connect(voter1).vote(1);
      await expect(
        secureVoting.connect(voter1).vote(2)
      ).to.be.revertedWith("Voter has already voted");
    });

    it("Should prevent unregistered voter from voting", async function () {
      await expect(
        secureVoting.connect(owner).vote(1)
      ).to.be.revertedWith("Voter not registered");
    });

    it("Should prevent invalid candidate voting", async function () {
      await expect(
        secureVoting.connect(voter1).vote(99)
      ).to.be.revertedWith("Invalid candidate ID");
    });

    it("Should count multiple votes correctly", async function () {
      await secureVoting.connect(voter1).vote(1);
      await secureVoting.connect(voter2).vote(1);
      await secureVoting.connect(voter3).vote(2);

      const candidate1 = await secureVoting.getCandidate(1);
      const candidate2 = await secureVoting.getCandidate(2);

      expect(candidate1.voteCount).to.equal(2);
      expect(candidate2.voteCount).to.equal(1);
    });
  });

  describe("Results and Queries", function () {
    beforeEach(async function () {
      // Register candidates
      await secureVoting.registerCandidate("Alice", "Candidate A");
      await secureVoting.registerCandidate("Bob", "Candidate B");
      await secureVoting.registerCandidate("Charlie", "Candidate C");

      // Register voters
      await secureVoting.registerVoter(voter1.address, VOTER_ID_HASH);
      await secureVoting.registerVoter(voter2.address, VOTER_ID_HASH);
      await secureVoting.registerVoter(voter3.address, VOTER_ID_HASH);

      // Start election and cast votes
      await secureVoting.startElection(1);
      await secureVoting.connect(voter1).vote(1);
      await secureVoting.connect(voter2).vote(1);
      await secureVoting.connect(voter3).vote(2);

      // End election
      await secureVoting.endElection();
    });

    it("Should get all candidates", async function () {
      const candidates = await secureVoting.getAllCandidates();
      expect(candidates.length).to.equal(3);
      expect(candidates[0].name).to.equal("Alice");
      expect(candidates[1].name).to.equal("Bob");
    });

    it("Should get election results", async function () {
      const results = await secureVoting.getElectionResults();
      expect(results[0].voteCount).to.equal(2);
      expect(results[1].voteCount).to.equal(1);
      expect(results[2].voteCount).to.equal(0);
    });

    it("Should get election winner", async function () {
      const winner = await secureVoting.getWinner();
      expect(winner.name).to.equal("Alice");
      expect(winner.voteCount).to.equal(2);
    });

    it("Should get election status", async function () {
      const [active, timeRemaining, totalVotes] =
        await secureVoting.getElectionStatus();
      expect(active).to.equal(false);
      expect(totalVotes).to.equal(3);
    });

    it("Should verify votes for auditability", async function () {
      const vote = await secureVoting.verifyVote(1);
      expect(vote.candidateId).to.equal(1);
    });
  });

  describe("Administrative Functions", function () {
    beforeEach(async function () {
      await secureVoting.registerCandidate("Alice", "Candidate A");
      await secureVoting.registerVoter(voter1.address, VOTER_ID_HASH);
    });

    it("Should remove a voter before voting", async function () {
      await secureVoting.removeVoter(voter1.address);
      const [isRegistered] = await secureVoting.getVoterStatus(
        voter1.address
      );
      expect(isRegistered).to.equal(false);
    });

    it("Should prevent non-commissioner from removing voter", async function () {
      await expect(
        secureVoting.connect(voter1).removeVoter(voter2.address)
      ).to.be.revertedWith("Only election commissioner can call this");
    });
  });
});
