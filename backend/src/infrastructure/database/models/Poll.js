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
    maxlength: 200,
  },
  options: [{
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

export const Poll = mongoose.model('Poll', pollSchema);
