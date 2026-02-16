// Voter Service - handles voter ID and IP
export const voterService = {
  getVoterId() {
    let voterId = localStorage.getItem('voterId');
    if (!voterId) {
      voterId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('voterId', voterId);
    }
    return voterId;
  },

  async getClientIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  },

  hasVoted(pollId) {
    return localStorage.getItem(`voted_${pollId}`) === 'true';
  },

  markAsVoted(pollId) {
    localStorage.setItem(`voted_${pollId}`, 'true');
  }
};
