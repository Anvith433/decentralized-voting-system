import React, { useContext, useState, useEffect, useCallback } from "react";
import { Web3Context } from "../context/Web3Context";
import { calculateTimeRemaining } from "../utils/helpers";
import { LockIcon, RefreshIcon } from "./Icons";
import "../styles/Results.css";

const Results = () => {
  const { getResults, getWinner, electionStatus } = useContext(Web3Context);
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxVotes, setMaxVotes] = useState(0);
  const [isForcedOpen, setIsForcedOpen] = useState(false);

  const performForcedLoad = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Get raw candidate data (This almost never reverts)
      const resultsData = await getResults();
      
      if (resultsData && resultsData.length > 0) {
        const mapped = resultsData.map(r => ({
          id: r.id,
          name: r.name,
          votes: parseInt(r.votes) || 0,
          description: r.description
        })).sort((a, b) => b.votes - a.votes);
        
        setResults(mapped);
        setMaxVotes(mapped[0].votes);

        // 2. FORCE THE WINNER DISPLAY
        // We set the winner locally first so the UI works even if getWinner() fails
        setWinner(mapped[0]);

        // 3. Optional: Try to sync with official on-chain winner
        try {
          const official = await getWinner();
          if (official) setWinner(official);
        } catch (e) {
          console.log("On-chain winner function is currently locked; using local calculation.");
        }
      }
    } catch (err) {
      console.error("Forced load failed:", err);
    } finally {
      setLoading(false);
    }
  }, [getResults, getWinner]);

  useEffect(() => {
    if (!electionStatus) return;

    const monitorEndConditions = () => {
      const remaining = calculateTimeRemaining(electionStatus.electionEnd);
      const isTimerUp = remaining === "Expired" || remaining.includes("-");
      const isStoppedByCommissioner = !electionStatus.electionActive;

      // FORCE REVEAL TRIGGER
      if (isTimerUp || isStoppedByCommissioner) {
        setIsForcedOpen(true);
        performForcedLoad();
        return true; 
      }
      return false;
    };

    const alreadyDone = monitorEndConditions();
    if (!alreadyDone) {
      const tracker = setInterval(() => {
        if (monitorEndConditions()) clearInterval(tracker);
      }, 1000);
      return () => clearInterval(tracker);
    }
  }, [electionStatus, performForcedLoad]);

  if (!electionStatus) {
    return <div className="results-message">Loading results…</div>;
  }

  if (!isForcedOpen) {
    return (
      <div className="results-container locked-state">
        <span className="lock-icon">
          <LockIcon size={20} />
        </span>
        <div className="locked-content">
          <h2>Results are sealed</h2>
          <p>
            The final tally will appear here automatically as soon as voting
            closes.
          </p>
        </div>
      </div>
    );
  }

  const totalCounted = results.reduce((sum, r) => sum + r.votes, 0);
  const winnerVotes = winner ? parseInt(winner.votes, 10) || 0 : 0;

  return (
    <div className="results-container fade-in">
      <div className="results-header">
        <div>
          <h2>Election results</h2>
          <p className="results-subtitle">Final tally, read from the contract</p>
        </div>
        <button
          className="refresh-button"
          onClick={performForcedLoad}
          disabled={loading}
        >
          <RefreshIcon size={15} className={loading ? "spinning" : ""} />
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {winner && (
        <div className="winner-card">
          <span className="winner-badge">Winner</span>
          <h3 className="winner-name">{winner.name}</h3>
          <p className="winner-stat">
            <strong>{winnerVotes}</strong> {winnerVotes === 1 ? "vote" : "votes"}
            {totalCounted > 0 && (
              <> &middot; {((winnerVotes / totalCounted) * 100).toFixed(1)}% of votes cast</>
            )}
          </p>
        </div>
      )}

      <ol className="standings">
        {results.map((candidate, index) => (
          <li
            key={candidate.id}
            className={`standing-row ${index === 0 ? "leading" : ""}`}
          >
            <span className="rank">{index + 1}</span>
            <span className="standing-name">{candidate.name}</span>
            <div className="standing-bar" aria-hidden="true">
              <div
                style={{
                  width: `${maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="standing-votes">
              {candidate.votes} <small>{candidate.votes === 1 ? "vote" : "votes"}</small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Results;