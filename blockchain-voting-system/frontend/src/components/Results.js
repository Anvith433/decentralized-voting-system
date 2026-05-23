import React, { useContext, useState, useEffect, useCallback } from "react";
import { Web3Context } from "../context/Web3Context";
import { calculateTimeRemaining } from "../utils/helpers"; 
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

  if (!electionStatus) return <div className="royal-msg">Initializing Secure Results...</div>;

  if (!isForcedOpen) {
    return (
      <div className="royal-results-container locked-state">
        <div className="locked-content">
          <span className="lock-icon">🔒</span>
          <h2>Results are Sealed</h2>
          <p>The cryptographic results will be automatically decrypted when voting concludes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="royal-results-container fade-in">
      <div className="royal-header">
        <div className="header-decoration"></div>
        <h1>Official Election Results</h1>
        <p className="declaration-date">Finalized Tally</p>
      </div>

      {/* ROYAL WINNER SECTION */}
      {winner && (
        <div className="royal-winner-card">
          <div className="winner-glow"></div>
          <div className="winner-body">
            <div className="crown-icon">🏆</div>
            <span className="winner-badge">ELECTED REPRESENTATIVE</span>
            <h2 className="winner-name-text">{winner.name}</h2>
            <div className="winner-stat-box">
              <span className="vote-total">{winner.votes}</span>
              <span className="vote-label">Verified Votes</span>
            </div>
          </div>
        </div>
      )}

      {/* FULL STANDINGS GRID */}
      <div className="royal-standings-grid">
        {results.map((candidate, index) => (
          <div key={index} className={`standing-card ${index === 0 ? 'gold-tier' : ''}`}>
            <div className="rank-label">RANK {index + 1}</div>
            <div className="candidate-row-info">
              <h3>{candidate.name}</h3>
              <div className="progress-royal-container">
                <div 
                  className="progress-royal-bar" 
                  style={{ width: `${maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="vote-count-royal">{candidate.votes} votes</span>
            </div>
          </div>
        ))}
      </div>

      <button className="royal-sync-btn" onClick={performForcedLoad}>
        {loading ? "Synchronizing..." : "🔄 Refresh Results"}
      </button>
    </div>
  );
};

export default Results;