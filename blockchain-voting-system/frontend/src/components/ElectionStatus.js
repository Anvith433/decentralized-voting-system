import React, { useEffect, useState } from "react";
import { calculateTimeRemaining } from "../utils/helpers";
import { ethers } from "ethers"; 
import "../styles/ElectionStatus.css";

const ElectionStatus = ({ status, contract, commissionerAddress, onElectionEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLocallyActive, setIsLocallyActive] = useState(true);
  const [isEndingOnChain, setIsEndingOnChain] = useState(false);

  // Sync local state with blockchain state on load
  useEffect(() => {
    if (!status) return;
    setIsLocallyActive(status.electionActive);
  }, [status]);

  useEffect(() => {
    // Only run timer if the election is active both on-chain and in our local logic
    if (!status || !status.electionActive || !isLocallyActive) return;

    const updateTime = () => {
      const remaining = calculateTimeRemaining(status.electionEnd);

      // TRIGGER: If helper returns "Expired", we handle the shutdown
      if (remaining === "Expired" || remaining.includes("-")) {
        handleTimerExpiry();
      } else {
        setTimeRemaining(remaining);
      }
    };

    const handleTimerExpiry = async () => {
      // 1. Instantly flip UI to 'Ended' (Red) so users stop voting
      setIsLocallyActive(false);
      setTimeRemaining("00h 00m 00s");

      // 2. Notify parent to fetch final results/winner
      if (onElectionEnd) onElectionEnd();

      // 3. Official On-Chain Finalization
      await finalizeOnChain();
    };

    const finalizeOnChain = async () => {
      // Safety check to prevent multiple transaction popups
      if (!contract || isEndingOnChain) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        // Only the Commissioner can officially update the contract state
        if (userAddress.toLowerCase() === commissionerAddress.toLowerCase()) {
          setIsEndingOnChain(true);
          console.log("Timer expired. Triggering on-chain endElection...");

          const tx = await contract.endElection();
          await tx.wait();
          
          console.log("Election state finalized on blockchain.");
          setIsEndingOnChain(false);
        }
      } catch (error) {
        console.error("Auto-finalization failed:", error);
        setIsEndingOnChain(false);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [status, isLocallyActive, contract, commissionerAddress, onElectionEnd]);

  if (!status) {
    return (
      <div className="election-status loading">
        <span className="loading-dot" />
        <p>Loading election status…</p>
      </div>
    );
  }

  // Final determination of status for the UI
  const displayActive = status.electionActive && isLocallyActive;

  const participation =
    status.registeredVoters > 0
      ? Math.min(
          ((status.totalVotesCast || 0) / status.registeredVoters) * 100,
          100
        )
      : 0;

  return (
    <div className={`election-status ${displayActive ? "active" : "ended"}`}>
      <div className="status-grid">
        <div className="status-item">
          <span className="label">Election status</span>
          <span className={`value state ${displayActive ? "active" : "ended"}`}>
            <span className="status-dot" />
            {displayActive ? "Voting open" : "Voting closed"}
          </span>
        </div>

        {displayActive ? (
          <div className="status-item">
            <span className="label">Time remaining</span>
            <span className="value timer">{timeRemaining}</span>
          </div>
        ) : (
          <div className="status-item">
            <span className="label">Result status</span>
            <span className="value results-announced">
              {isEndingOnChain ? "Finalizing on-chain…" : "Results announced"}
            </span>
          </div>
        )}

        <div className="status-item">
          <span className="label">Votes cast</span>
          <span className="value">{status.totalVotesCast || 0}</span>
        </div>

        <div className="status-item">
          <span className="label">Participation</span>
          <span className="value">
            {participation.toFixed(1)}
            <small>%</small>
          </span>
          <div className="participation-bar" aria-hidden="true">
            <div style={{ width: `${participation}%` }} />
          </div>
        </div>
      </div>

      {/* Show the winner results if they exist in the status object */}
      {!displayActive && status.winner && (
        <div className="winner-display">
          <span className="label">Winner</span>
          <strong>{status.winner.name}</strong>
          <span>{status.winner.voteCount.toString()} votes</span>
        </div>
      )}

      {!displayActive && (
        <div className="election-footer-note">
          {isEndingOnChain
            ? "Updating blockchain records… please sign the MetaMask transaction."
            : "The election has concluded. Results are finalized."}
        </div>
      )}
    </div>
  );
};

export default ElectionStatus;