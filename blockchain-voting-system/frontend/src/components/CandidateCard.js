import React from "react";
import PropTypes from "prop-types";
import { CheckIcon } from "./Icons";
import "../styles/CandidateCard.css";

const CandidateCard = ({
  candidate,
  onVote,
  isVoting,
  hasVoted,
  electionActive,
  totalVotes,
}) => {
  const handleVote = () => {
    if (onVote) {
      onVote(candidate.id);
    }
  };

  const votes = parseInt(candidate.votes, 10) || 0;
  const share = totalVotes > 0 ? Math.min((votes / totalVotes) * 100, 100) : 0;

  return (
    <article className="candidate-card">
      <div className="candidate-id" aria-label={`Candidate ${candidate.id}`}>
        {String(candidate.id).padStart(2, "0")}
      </div>

      <div className="card-body">
        <h3>{candidate.name}</h3>
        {candidate.description && (
          <p className="description">{candidate.description}</p>
        )}

        <div className="vote-stats">
          <div className="progress-bar" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${share}%` }} />
          </div>
          <span className="vote-count">
            {votes} {votes === 1 ? "vote" : "votes"}
            {totalVotes > 0 && (
              <span className="vote-share"> · {share.toFixed(0)}%</span>
            )}
          </span>
        </div>
      </div>

      <div className="card-footer">
        {hasVoted ? (
          <span className="already-voted">
            <CheckIcon size={15} />
            Ballot cast
          </span>
        ) : electionActive ? (
          <button
            className="vote-button"
            onClick={handleVote}
            disabled={isVoting}
            aria-label={`Vote for ${candidate.name}`}
          >
            {isVoting ? "Submitting…" : "Vote"}
          </button>
        ) : (
          <span className="election-ended">Closed</span>
        )}
      </div>
    </article>
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
  totalVotes: PropTypes.number,
};

CandidateCard.defaultProps = {
  isVoting: false,
  hasVoted: false,
  electionActive: true,
  totalVotes: 0,
};

export default CandidateCard;
