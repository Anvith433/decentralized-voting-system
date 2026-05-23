import React from "react";
import PropTypes from "prop-types";
import "../styles/CandidateCard.css";

const CandidateCard = ({ candidate, onVote, isVoting, hasVoted, electionActive }) => {
  const handleVote = () => {
    if (onVote) {
      onVote(candidate.id);
    }
  };

  return (
    <div className="candidate-card">
      <div className="card-header">
        <h3>{candidate.name}</h3>
        <div className="candidate-id">ID: {candidate.id}</div>
      </div>

      <div className="card-body">
        <p className="description">{candidate.description}</p>

        <div className="vote-stats">
          <div className="vote-count">
            <span className="label">Votes:</span>
            <span className="value">{candidate.votes || 0}</span>
          </div>
          <div className="vote-percentage">
            <span className="label">Progress</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(candidate.votes || 0) * 5}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        {hasVoted ? (
          <div className="already-voted">✓ You have voted</div>
        ) : electionActive ? (
          <button
            className="vote-button"
            onClick={handleVote}
            disabled={isVoting}
          >
            {isVoting ? "Voting..." : "Vote for " + candidate.name}
          </button>
        ) : (
          <div className="election-ended">Election Ended</div>
        )}
      </div>
    </div>
  );
};

CandidateCard.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    votes: PropTypes.string,
  }).isRequired,
  onVote: PropTypes.func,
  isVoting: PropTypes.bool,
  hasVoted: PropTypes.bool,
  electionActive: PropTypes.bool,
};

CandidateCard.defaultProps = {
  isVoting: false,
  hasVoted: false,
  electionActive: true,
};

export default CandidateCard;
