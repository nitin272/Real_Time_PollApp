import { Vote } from '../infrastructure/database/models/Vote.js';

export class VoteRepository {
  async create(pollId, voterId, optionIndex, ip) {
    const vote = new Vote({ pollId, voterId, optionIndex, ip });
    await vote.save();
    return vote;
  }

  async hasVoted(pollId, voterId) {
    const count = await Vote.countDocuments({ pollId, voterId });
    return count > 0;
  }

  async getLastVoteTimeByIp(pollId, ip) {
    const vote = await Vote.findOne({ pollId, ip })
      .sort({ votedAt: -1 })
      .select('votedAt');
    
    return vote ? vote.votedAt : null;
  }

  async findByPollId(pollId) {
    return await Vote.find({ pollId });
  }

  async calculateResults(pollId, optionsCount) {
    const votes = await Vote.find({ pollId }).select('optionIndex');
    
    const results = new Array(optionsCount).fill(0);
    votes.forEach(vote => {
      if (vote.optionIndex >= 0 && vote.optionIndex < optionsCount) {
        results[vote.optionIndex]++;
      }
    });

    return results;
  }

  async countVotes(pollId) {
    return await Vote.countDocuments({ pollId });
  }

  async deleteByPollId(pollId) {
    return await Vote.deleteMany({ pollId });
  }
}

export const voteRepository = new VoteRepository();
