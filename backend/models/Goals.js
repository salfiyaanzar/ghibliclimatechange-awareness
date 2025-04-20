const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  goal: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['personal', 'home', 'community'], // Only these 3 categories are allowed
    lowercase: true
  },
  completed: {
    type: Boolean,
    default: false // default value set to false
  }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
