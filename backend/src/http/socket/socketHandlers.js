import { pollService } from '../../services/PollService.js';
import { voteService } from '../../services/VoteService.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('✓ Client connected:', socket.id);

    socket.on('join-poll', async (pollId) => {
      await handleJoinPoll(socket, pollId);
    });

    socket.on('vote', async (data) => {
      await handleVote(socket, io, data);
    });

    socket.on('disconnect', () => {
      console.log('✗ Client disconnected:', socket.id);
    });
  });
}

async function handleJoinPoll(socket, pollId) {
  try {
    socket.join(pollId);
    const poll = await pollService.getPollWithResults(pollId);
    socket.emit('poll-data', poll);
  } catch (error) {
    socket.emit('poll-error', error.message);
  }
}

async function handleVote(socket, io, data) {
  try {
    const { pollId, optionIndex, voterId, ip } = data;
    const results = await voteService.submitVote(pollId, voterId, optionIndex, ip);

    io.to(pollId).emit('results-update', results);
    socket.emit('vote-success');
  } catch (error) {
    socket.emit('vote-error', error.message);
  }
}
