import { pollRepository } from '../repositories/PollRepository.js';
import { voteRepository } from '../repositories/VoteRepository.js';
import { validateVote } from '../utils/validation.js';
import { antiAbuseService } from './AntiAbuseService.js';

export class VoteService {
  async submitVote(pollId, voterId, optionIndex, ip) {
    const poll = await pollRepository.findByPollId(pollId);
    
    const voteValidation = validateVote(poll, optionIndex);
    if (!voteValidation.isValid) {
      throw new Error(voteValidation.error);
    }

    const abuseCheck = await antiAbuseService.validateVote(pollId, voterId, ip);
    if (!abuseCheck.allowed) {
      throw new Error(abuseCheck.reason);
    }

    await voteRepository.create(pollId, voterId, optionIndex, ip);

    const results = await voteRepository.calculateResults(pollId, poll.options.length);
    return results;
  }

  async getResults(pollId) {
    const poll = await pollRepository.findByPollId(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    return await voteRepository.calculateResults(pollId, poll.options.length);
  }
}

export const voteService = new VoteService();
