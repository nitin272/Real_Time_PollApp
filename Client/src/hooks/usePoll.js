// Hook: usePoll - manages poll data and real-time updates
import { useState, useEffect } from 'react';
import { socketService } from '../services/socket';

export const usePoll = (pollId) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pollId) return;

    const socket = socketService.connect();
    socketService.joinPoll(pollId);

    socketService.onPollData((data) => {
      setPoll(data);
      setLoading(false);
    });

    socketService.onResultsUpdate((results) => {
      setPoll(prev => prev ? { ...prev, results } : null);
    });

    return () => {
      socketService.off('poll-data');
      socketService.off('results-update');
    };
  }, [pollId]);

  return { poll, loading };
};
