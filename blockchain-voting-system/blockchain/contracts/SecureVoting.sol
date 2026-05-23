// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureVoting {

    address public electionCommissioner;
uint256 public electionStart;
uint256 public electionEnd;
bool public electionActive;

struct Candidate {
    uint256 id;
    string name;
    string description;
    uint256 voteCount;
    uint256 registrationTime;
}

struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint256 votedCandidateId;
    uint256 votingTime;
    string voterIdHash; 
}

struct Vote {
    uint256 candidateId;
    uint256 timestamp;
    bytes32 txHash;
}

mapping(address => Voter) public voters;
mapping(uint256 => Candidate) public candidates;
mapping(uint256 => Vote) public voteHistory;

uint256 public candidateCount;
uint256 public totalVotes;
uint256 public registeredVoters;

event CandidateRegistered(uint256 indexed candidateId, string name, uint256 timestamp);
event VoterRegistered(address indexed voter, uint256 timestamp);
event VoteCast(address indexed voter, uint256 indexed candidateId, uint256 timestamp);
event ElectionStarted(uint256 startTime, uint256 endTime);
event ElectionEnded(uint256 endTime);
event VoterVerified(address indexed voter, uint256 timestamp);

modifier onlyElectionCommissioner() {
    require(msg.sender == electionCommissioner, "Only election commissioner can call this");
    _;
}

modifier onlyDuringElection() {
    require(electionActive && block.timestamp >= electionStart && block.timestamp <= electionEnd,
        "Voting is not currently active");
    _;
}

modifier onlyRegisteredVoter() {
    require(voters[msg.sender].isRegistered, "Voter is not registered");
    _;
}

modifier onlyEligibleVoter() {
    require(voters[msg.sender].isRegistered, "Voter not registered");
    require(!voters[msg.sender].hasVoted, "Voter has already voted");
    _;
}

constructor(address _commissioner) {
    require(_commissioner != address(0), "Invalid commissioner address");
    electionCommissioner = _commissioner;
    candidateCount = 0;
    totalVotes = 0;
    registeredVoters = 0;
    electionActive = false;
}

function registerCandidate(string memory _name, string memory _description)
    public
    onlyElectionCommissioner
{
    require(bytes(_name).length > 0, "Candidate name cannot be empty");
    require(bytes(_description).length > 0, "Candidate description cannot be empty");
    
    candidateCount++;
    candidates[candidateCount] = Candidate({
        id: candidateCount,
        name: _name,
        description: _description,
        voteCount: 0,
        registrationTime: block.timestamp
    });
    
    emit CandidateRegistered(candidateCount, _name, block.timestamp);
}

function registerVoter(address _voter, string memory _voterIdHash)
    public
    onlyElectionCommissioner
{
    require(_voter != address(0), "Invalid voter address");
    require(!voters[_voter].isRegistered, "Voter already registered");
    require(bytes(_voterIdHash).length > 0, "Voter ID hash cannot be empty");
    
    voters[_voter] = Voter({
        isRegistered: true,
        hasVoted: false,
        votedCandidateId: 0,
        votingTime: 0,
        voterIdHash: _voterIdHash
    });
    
    registeredVoters++;
    emit VoterRegistered(_voter, block.timestamp);
}

function registerMultipleVoters(address[] memory _voterAddresses)
    public
    onlyElectionCommissioner
{
    for (uint256 i = 0; i < _voterAddresses.length; i++) {
        if (!voters[_voterAddresses[i]].isRegistered) {
            voters[_voterAddresses[i]] = Voter({
                isRegistered: true,
                hasVoted: false,
                votedCandidateId: 0,
                votingTime: 0,
                voterIdHash: ""
            });
            registeredVoters++;
            emit VoterRegistered(_voterAddresses[i], block.timestamp);
        }
    }
}

function startElection(uint256 _durationInHours)
    public
    onlyElectionCommissioner
{
    require(_durationInHours > 0, "Election duration must be greater than 0");
    require(!electionActive, "Election is already active");
    require(candidateCount > 0, "No candidates registered");
    
  
    // This now allows the election to start even if the voter list is currently empty.
    
    electionStart = block.timestamp;
    electionEnd = block.timestamp + (_durationInHours * 1 hours);
    electionActive = true;
    
    emit ElectionStarted(electionStart, electionEnd);
}

function endElection()
    public
    onlyElectionCommissioner
{
    require(electionActive, "Election is not active");
    
    electionActive = false;
    emit ElectionEnded(block.timestamp);
}

function vote(uint256 _candidateId)
    public
    onlyDuringElection
    onlyEligibleVoter
{
    require(msg.sender != electionCommissioner, "Commissioner is not allowed to vote");
    require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
    
    voters[msg.sender].hasVoted = true;
    voters[msg.sender].votedCandidateId = _candidateId;
    voters[msg.sender].votingTime = block.timestamp;
    
    candidates[_candidateId].voteCount++;
    
    totalVotes++;
    voteHistory[totalVotes] = Vote({
        candidateId: _candidateId,
        timestamp: block.timestamp,
        txHash: keccak256(abi.encodePacked(msg.sender, _candidateId, block.timestamp))
    });
    
    emit VoteCast(msg.sender, _candidateId, block.timestamp);
}

function getCandidate(uint256 _candidateId)
    public
    view
    returns (Candidate memory)
{
    require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
    return candidates[_candidateId];
}

function getAllCandidates()
    public
    view
    returns (Candidate[] memory)
{
    Candidate[] memory allCandidates = new Candidate[](candidateCount);
    for (uint256 i = 1; i <= candidateCount; i++) {
        allCandidates[i - 1] = candidates[i];
    }
    return allCandidates;
}

function getVoterStatus(address _voter)
    public
    view
    returns (bool isRegistered, bool hasVoted)
{
    return (voters[_voter].isRegistered, voters[_voter].hasVoted);
}

function getElectionResults()
    public
    view
    returns (Candidate[] memory)
{
    Candidate[] memory results = new Candidate[](candidateCount);
    for (uint256 i = 1; i <= candidateCount; i++) {
        results[i - 1] = candidates[i];
    }
    return results;
}

function getWinner()
    public
    view
    returns (Candidate memory)
{
    require(candidateCount > 0, "No candidates");
    require(!electionActive, "Election is still active");
    
    uint256 winnerId = 1;
    for (uint256 i = 2; i <= candidateCount; i++) {
        if (candidates[i].voteCount > candidates[winnerId].voteCount) {
            winnerId = i;
        }
    }
    return candidates[winnerId];
}

function getElectionStatus()
    public
    view
    returns (bool active, uint256 timeRemaining, uint256 totalVotesCast)
{
    active = electionActive;
    timeRemaining = electionActive && block.timestamp < electionEnd 
        ? electionEnd - block.timestamp 
        : 0;
    totalVotesCast = totalVotes;
}

function verifyVote(uint256 _voteIndex)
    public
    view
    returns (Vote memory)
{
    require(_voteIndex > 0 && _voteIndex <= totalVotes, "Invalid vote index");
    return voteHistory[_voteIndex];
}

function getVoteHistory()
    public
    view
    returns (Vote[] memory)
{
    Vote[] memory history = new Vote[](totalVotes);
    for (uint256 i = 1; i <= totalVotes; i++) {
        history[i - 1] = voteHistory[i];
    }
    return history;
}

function removeVoter(address _voter)
    public
    onlyElectionCommissioner
{
    require(voters[_voter].isRegistered, "Voter not registered");
    require(!voters[_voter].hasVoted, "Cannot remove voter who has already voted");
    
    voters[_voter].isRegistered = false;
    registeredVoters--;
}


}