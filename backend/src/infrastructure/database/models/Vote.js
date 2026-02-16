// Vote Model - Database Schema
import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  pollId: {
    type: String,
    required: true,
    index: true,
  },
  voterId: {
    type: String,
    required: true,
  },
  optionIndex: {
    type: Number,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one vote per voter per poll
voteSchema.index({ pollId: 1, voterId: 1 }, { unique: true });

// Index for IP-based rate limiting
voteSchema.index({ pollId: 1, ip: 1, votedAt: 1 });

export const Vote = mongoose.model('Vote', voteSchema);
