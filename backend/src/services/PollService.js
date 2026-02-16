import { nanoid } from 'nanoid';
import { pollRepository } from '../repositories/PollRepository.js';
import { voteRepository } from '../repositories/VoteRepository.js';
import { validatePollCreation } from '../utils/validation.js';

export class PollService {
  async createPoll(question, options) {
    const validation = validatePollCreation(question, options);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const pollId = nanoid(10);
    const poll = await pollRepository.create(pollId, question, options);

    return {
      id: poll.pollId,
      question: poll.question,
      options: poll.options,
      createdAt: poll.createdAt,
    };
  }

  async getPollWithResults(pollId) {
    const poll = await pollRepository.findByPollId(pollId);
    
    if (!poll) {
      throw new Error('Poll not found');
    }

    const results = await voteRepository.calculateResults(pollId, poll.options.length);

    return {
      id: poll.pollId,
      question: poll.question,
      options: poll.options,
      results,
      createdAt: poll.createdAt,
    };
  }

  async pollExists(pollId) {
    return await pollRepository.exists(pollId);
  }
}

export const pollService = new PollService();
