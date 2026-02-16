// Anti-abuse service
import { CONFIG } from '../config/constants.js';
import { pollStorage } from '../storage/pollStorage.js';

export class AntiAbuseService {
  // Check if IP can vote (rate limiting)
  canIpVote(pollId, ip) {
    const lastVoteTime = pollStorage.getLastVoteTime(pollId, ip);
    
    if (!lastVoteTime) {
      return { allowed: true };
    }

    const timeSinceLastVote = Date.now() - lastVoteTime;
    
    if (timeSinceLastVote < CONFIG.VOTE_COOLDOWN_MS) {
      const waitTime = Math.ceil((CONFIG.VOTE_COOLDOWN_MS - timeSinceLastVote) / 1000);
      return {
        allowed: false,
        reason: `Please wait ${waitTime} seconds before voting again`,
      };
    }

    return { allowed: true };
  }

  // Check if voter ID has already voted
  hasVoterVoted(pollId, voterId) {
    const hasVoted = pollStorage.hasVoted(pollId, voterId);
    
    if (hasVoted) {
      return {
        allowed: false,
        reason: 'You have already voted on this poll',
      };
    }

    return { allowed: true };
  }

  // Validate vote against all anti-abuse rules
  validateVote(pollId, voterId, ip) {
    // Check 1: Voter ID (browser fingerprint)
    const voterCheck = this.hasVoterVoted(pollId, voterId);
    if (!voterCheck.allowed) {
      return voterCheck;
    }

    // Check 2: IP rate limiting
    const ipCheck = this.canIpVote(pollId, ip);
    if (!ipCheck.allowed) {
      return ipCheck;
    }

    return { allowed: true };
  }
}

export const antiAbuseService = new AntiAbuseService();
