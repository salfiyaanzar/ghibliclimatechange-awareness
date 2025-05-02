const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const authenticate = require('../middleware/Authenticate');

const router = express.Router();

// Input validation middleware
const validatePost = (req, res, next) => {
  const { title, text, category } = req.body;
  
  if (!title || !text || !category) {
    return res.status(400).json({
      success: false,
      error: 'Please provide title, text, and category.'
    });
  }

  if (title.trim().length === 0 || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Title and text cannot be empty.'
    });
  }

  next();
};

// Create a new post (authenticated)
router.post('/post-story', authenticate, validatePost, async (req, res) => {
  try {
    const { title, text, category } = req.body;

    const post = new Post({
      title,
      text,
      category,
      author: {
        userId: req.user.userId,
        username: req.user.email
      }
    });

    const savedPost = await post.save();
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: savedPost
    });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({
      success: false,
      error: 'Error creating post. Please try again.'
    });
  }
});

// Get all posts with optional search and pagination
router.get('/get-story', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = search
      ? { $text: { $search: search } }
      : {};

    const posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select('title text category author createdAt updatedAt');

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({
      success: false,
      error: 'Error fetching posts. Please try again.'
    });
  }
});

// Get a single post by ID
router.get('/get-story/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID'
      });
    }

    const post = await Post.findById(req.params.id)
      .select('title text category author createdAt updatedAt');
      
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      post
    });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({
      success: false,
      error: 'Error fetching post. Please try again.'
    });
  }
});

// Update a post completely (authenticated, author-only)
router.put('/update-story/:id', authenticate, validatePost, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    if (post.author.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: You are not the author of this post'
      });
    }

    const { title, text, category } = req.body;
    post.title = title;
    post.text = text;
    post.category = category;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({
      success: false,
      error: 'Error updating post. Please try again.'
    });
  }
});

// Partially update a post (authenticated, author-only)
router.patch('/patch-story/:id', authenticate, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    if (post.author.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: You are not the author of this post'
      });
    }

    const updates = req.body;
    const allowedUpdates = ['title', 'text', 'category'];
    const updateKeys = Object.keys(updates);

    const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));
    if (!isValidUpdate || updateKeys.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid updates: only title, text, or category can be updated'
      });
    }

    updateKeys.forEach(key => {
      if (updates[key] && updates[key].trim().length > 0) {
        post[key] = updates[key];
      }
    });
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({
      success: false,
      error: 'Error updating post. Please try again.'
    });
  }
});

module.exports = router;