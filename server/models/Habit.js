const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['Fitness', 'Coding', 'Health', 'Mindset', 'Finance', 'Learning', 'Mindfulness', 'Productivity', 'Other'],
    default: 'Other'
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly'],
    default: 'Daily'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: '🎯'
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  // 🔥 EXTENDED MATRIX LOGIC: Direct Day-by-Day completion array tracking for the clean horizontal grid layout
  weeklyLogs: [
    {
      dateStr: { type: String, required: true }, // Format: YYYY-MM-DD
      status: { type: String, enum: ['Completed', 'Pending'], default: 'Pending' }
    }
  ],
  isArchived: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);