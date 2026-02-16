import { voteRepository } from '../repositories/VoteRepository.js';

export class AntiAbuseService {
  constructor() {
    this.voteCooldownMs = parseInt(process.env.VOTE_COOLDOWN_MS) || 5000;
  }

  async canIpVote(pollId, ip) {
    const lastVoteTime = await voteRepository.getLastVoteTimeByIp(pollId, ip);
    
    if (!lastVoteTime) {
      return { allowed: true };
    }

    const timeSinceLastVote = Date.now() - lastVoteTime.getTime();
    
    if (timeSinceLastVote < this.voteCooldownMs) {
      const waitTime = Math.ceil((this.voteCooldownMs - timeSinceLastVote) / 1000);
      return {
        allowed: false,
        reason: `Please wait ${waitTime} seconds before voting again`,
      };
    }

    return { allowed: true };
  }

  async hasVoterVoted(pollId, voterId) {
    const hasVoted = await voteRepository.hasVoted(pollId, voterId);
    
    if (hasVoted) {
      return {
        allowed: false,
        reason: 'You have already voted on this poll',
      };
    }

    return { allowed: true };
  }

  async validateVote(pollId, voterId, ip) {
    const voterCheck = await this.hasVoterVoted(pollId, voterId);
    if (!voterCheck.allowed) {
      return voterCheck;
    }

    const ipCheck = await this.canIpVote(pollId, ip);
    if (!ipCheck.allowed) {
      return ipCheck;
    }

    return { allowed: true };
  }
}

export const antiAbuseService = new AntiAbuseService();
