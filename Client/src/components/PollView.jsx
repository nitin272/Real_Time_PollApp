// Component: Poll View
import { useState, useEffect } from 'react';
import { usePoll } from '../hooks/usePoll';
import { useVote } from '../hooks/useVote';
import { voterService } from '../services/voter';
import './PollView.css';

export const PollView = ({ pollId }) => {
  const { poll, loading } = usePoll(pollId);
  const { vote, voting, voteError, hasVoted } = useVote();
  const [selectedOption, setSelectedOption] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    if (pollId) {
      setAlreadyVoted(voterService.hasVoted(pollId));
    }
  }, [pollId]);

  const handleVote = async () => {
    if (selectedOption === null) return;
    await vote(pollId, selectedOption);
  };

  const getTotalVotes = () => {
    return poll?.results?.reduce((sum, count) => sum + count, 0) || 0;
  };

  const getPercentage = (index) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((poll.results[index] / total) * 100);
  };

  const shareUrl = `${window.location.origin}/poll/${pollId}`;

  if (loading) {
    return <div className="loading">Loading poll...</div>;
  }

  if (!poll) {
    return <div className="error">Poll not found</div>;
  }

  const showResults = hasVoted || alreadyVoted;

  return (
    <div className="poll-view">
      <h1>{poll.question}</h1>

      {!showResults ? (
        <div className="voting-section">
          <div className="options">
            {poll.options.map((option, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name="poll-option"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          {voteError && <div className="error">{voteError}</div>}

          <button
            onClick={handleVote}
            disabled={selectedOption === null || voting}
            className="btn-primary"
          >
            {voting ? 'Voting...' : 'Vote'}
          </button>
        </div>
      ) : (
        <div className="results-section">
          <p className="voted-message">✓ You have voted</p>
          <div className="results">
            {poll.options.map((option, index) => (
              <div key={index} className="result-item">
                <div className="result-header">
                  <span className="option-name">{option}</span>
                  <span className="percentage">{getPercentage(index)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getPercentage(index)}%` }}
                  />
                </div>
                <span className="vote-count">{poll.results[index]} votes</span>
              </div>
            ))}
          </div>
          <p className="total-votes">Total votes: {getTotalVotes()}</p>
        </div>
      )}

      <div className="share-section">
        <label>Share this poll:</label>
        <div className="share-input">
          <input type="text" value={shareUrl} readOnly />
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="btn-copy"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};
