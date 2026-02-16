// Hook: usePoll - manages poll data and real-time updates
import { useState, useEffect } from 'react';
import { socketService } from '../services/socket';

export const usePoll = (pollId) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pollId) return;

    const socket = socketService.connect();
    
    const handlePollData = (data) => {
      setPoll(data);
      setLoading(false);
      setError(null);
    };

    const handleResultsUpdate = (results) => {
      setPoll(prev => prev ? { ...prev, results } : null);
    };

    const handlePollError = (errorMsg) => {
      setError(errorMsg);
      setLoading(false);
    };

    socketService.joinPoll(pollId);
    socketService.onPollData(handlePollData);
    socketService.onResultsUpdate(handleResultsUpdate);
    socket.on('poll-error', handlePollError);

    return () => {
      socketService.off('poll-data');
      socketService.off('results-update');
      socket.off('poll-error');
      socketService.disconnect();
    };
  }, [pollId]);

  return { poll, loading, error };
};
