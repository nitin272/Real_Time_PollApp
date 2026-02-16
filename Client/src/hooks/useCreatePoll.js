// Hook: useCreatePoll - handles poll creation
import { useState } from 'react';
import { pollApi } from '../services/api';

export const useCreatePoll = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPoll = async (question, options) => {
    setLoading(true);
    setError(null);

    try {
      // Validate
      if (!question || question.trim().length === 0) {
        throw new Error('Question is required');
      }

      const cleanOptions = options.filter(opt => opt.trim().length > 0);
      if (cleanOptions.length < 2) {
        throw new Error('At least 2 options are required');
      }

      const result = await pollApi.createPoll(question, cleanOptions);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPoll, loading, error };
};
