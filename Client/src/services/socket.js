// Socket Service
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinPoll(pollId) {
    this.socket?.emit('join-poll', pollId);
  }

  vote(pollId, optionIndex, voterId, ip) {
    return new Promise((resolve, reject) => {
      this.socket?.emit('vote', { pollId, optionIndex, voterId, ip });
      this.socket?.once('vote-success', () => resolve());
      this.socket?.once('vote-error', (error) => reject(new Error(error)));
    });
  }

  onPollData(callback) {
    this.socket?.on('poll-data', callback);
  }

  onResultsUpdate(callback) {
    this.socket?.on('results-update', callback);
  }

  off(event) {
    this.socket?.off(event);
  }
}

export const socketService = new SocketService();
