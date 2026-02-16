import { Poll } from '../infrastructure/database/models/Poll.js';

export class PollRepository {
  async create(pollId, question, options) {
    const poll = new Poll({ pollId, question, options });
    await poll.save();
    return poll;
  }

  async findByPollId(pollId) {
    return await Poll.findOne({ pollId });
  }

  async exists(pollId) {
    const count = await Poll.countDocuments({ pollId });
    return count > 0;
  }

  async findAll(limit = 100) {
    return await Poll.find().sort({ createdAt: -1 }).limit(limit);
  }

  async delete(pollId) {
    return await Poll.deleteOne({ pollId });
  }
}

export const pollRepository = new PollRepository();
