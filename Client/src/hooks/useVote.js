// Hook: useVote - handles voting logic
import { useState } from 'react';
import { socketService } from '../services/socket';
import { voterService } from '../services/voter';

export const useVote = () => {
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const vote = async (pollId, optionIndex) => {
    setVoting(true);
    setVoteError(null);

    try {
      const voterId = voterService.getVoterId();
      const ip = await voterService.getClientIp();
      
      socketService.connect();
      await socketService.vote(pollId, optionIndex, voterId, ip);
      
      setHasVoted(true);
      voterService.markAsVoted(pollId);
    } catch (err) {
      setVoteError(err.message);
    } finally {
      setVoting(false);
    }
  };

  return { vote, voting, voteError, hasVoted };
};
