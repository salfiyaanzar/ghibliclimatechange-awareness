const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  text: {
    type: String,
    required: [true, 'Post text is required'],
    trim: true,
    maxlength: [2500, 'Post text cannot exceed 500 words (approximately 2500 characters)']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Community action', 'Education', 'Climate Policy'],
      message: 'Category must be either Community action, Education, or Climate Policy'
    }
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    username: {
      type: String,
      required: [true, 'Username is required']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for searching
postSchema.index({ title: 'text', text: 'text' });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;