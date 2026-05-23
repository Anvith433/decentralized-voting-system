import React, { useContext, useState, useEffect, useCallback } from "react";
import { Web3Context } from "../context/Web3Context";
import CandidateCard from "./CandidateCard";
import "../styles/VotingPanel.css";

const VotingPanel = () => {
  const {
    account,
    contract,
    loading,
    error,
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
      setSuccessMessage(
        `✓ Vote cast successfully for candidate ${candidateId}!`
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

  return (
    <div className="voting-panel">
      <div className="panel-header">
        <h2>🗳️ Voting Panel</h2>
        {!account && (
          <div className="warning">
            Please connect your wallet to participate in voting
          </div>
        )}
        {account && voterStatus && !voterStatus.isRegistered && (
          <div className="warning">
            Your address is not registered as a voter
          </div>
        )}
        {account && voterStatus && voterStatus.hasVoted && (
          <div className="success">✓ You have already voted</div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {successMessage && (
        <div className="success-message">
          <div>{successMessage}</div>
          {transactionHash && (
            <small>
              Transaction:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {transactionHash.substring(0, 10)}...
              </a>
            </small>
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
            />
          ))
        ) : (
          <div className="no-candidates">
            {loading ? "Loading candidates..." : "No candidates registered"}
          </div>
        )}
      </div>

      {loading && <div className="loading">Processing...</div>}
    </div>
  );
};

export default VotingPanel;