import React, { useContext, useState, useEffect, useCallback } from "react";
import { Web3Context } from "../context/Web3Context";
import CandidateCard from "./CandidateCard";
import { ExternalIcon } from "./Icons";
import "../styles/VotingPanel.css";

const VotingPanel = () => {
  const {
    account,
    contract,
    loading,
    castVote,
    getCandidates,
    getVoterStatus,
    electionStatus,
  } = useContext(Web3Context);

  const [candidates, setCandidates] = useState([]);
  const [voterStatus, setVoterStatus] = useState(null);
  const [voting, setVoting] = useState(false);
  const [votingCandidateId, setVotingCandidateId] = useState(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadCandidates = useCallback(async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error("Error loading candidates:", err);
    }
  }, [getCandidates]);

  const loadVoterStatus = useCallback(async () => {
    try {
      const status = await getVoterStatus(account);
      setVoterStatus(status);
    } catch (err) {
      console.error("Error loading voter status:", err);
    }
  }, [getVoterStatus, account]);

  useEffect(() => {
    loadCandidates();
  }, [contract, loadCandidates]);

  useEffect(() => {
    if (account) {
      loadVoterStatus();
    }
  }, [account, loadVoterStatus]);

  const handleVote = async (candidateId) => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    if (voterStatus && voterStatus.hasVoted) {
      alert("You have already voted!");
      return;
    }

    try {
      setVoting(true);
      setVotingCandidateId(candidateId);
      setTransactionHash("");
      setSuccessMessage("");

      const receipt = await castVote(candidateId);
      setTransactionHash(receipt.hash || receipt.transactionHash);
      const chosen = candidates.find((c) => c.id === candidateId);
      setSuccessMessage(
        `Your vote for ${chosen ? chosen.name : `candidate ${candidateId}`} has been recorded.`
      );

      setTimeout(loadVoterStatus, 1000);
      setTimeout(loadCandidates, 1000);

      setTimeout(() => {
        setSuccessMessage("");
        setTransactionHash("");
      }, 5000);
    } catch (err) {
      console.error("Error voting:", err);
      alert(`Failed to vote: ${err.message}`);
    } finally {
      setVoting(false);
      setVotingCandidateId(null);
    }
  };

  const totalVotes = electionStatus
    ? parseInt(electionStatus.totalVotesCast, 10) || 0
    : 0;

  return (
    <div className="voting-panel">
      <div className="panel-header">
        <div>
          <h2>Ballot</h2>
          <p className="panel-subtitle">
            Choose one candidate. Once your vote is confirmed on-chain it
            can&rsquo;t be changed.
          </p>
        </div>
        {candidates.length > 0 && (
          <span className="panel-count">
            {candidates.length}{" "}
            {candidates.length === 1 ? "candidate" : "candidates"}
          </span>
        )}
      </div>

      {!account && (
        <div className="notice warning">
          Please connect your wallet to participate in voting.
        </div>
      )}
      {account && voterStatus && !voterStatus.isRegistered && (
        <div className="notice warning">
          This wallet address isn&rsquo;t registered as a voter, so it
          can&rsquo;t cast a ballot.
        </div>
      )}
      {account && voterStatus && voterStatus.hasVoted && (
        <div className="notice success">
          You have already voted. Thanks for taking part.
        </div>
      )}

      {successMessage && (
        <div className="notice success success-message">
          <span>{successMessage}</span>
          {transactionHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View transaction {transactionHash.substring(0, 10)}…
              <ExternalIcon size={14} />
            </a>
          )}
        </div>
      )}

      <div className="candidates-grid">
        {candidates && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onVote={handleVote}
              isVoting={voting && votingCandidateId === candidate.id}
              hasVoted={voterStatus && voterStatus.hasVoted}
              electionActive={electionStatus && electionStatus.electionActive}
              totalVotes={totalVotes}
            />
          ))
        ) : (
          <div className="no-candidates">
            {loading ? "Loading candidates…" : "No candidates registered yet."}
          </div>
        )}
      </div>

      {loading && <div className="loading">Waiting for the blockchain…</div>}
    </div>
  );
};

export default VotingPanel;