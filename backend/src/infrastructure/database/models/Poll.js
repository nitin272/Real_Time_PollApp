// Poll Model - Database Schema
import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  pollId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    type: String,
    required: true,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Poll = mongoose.model('Poll', pollSchema);
