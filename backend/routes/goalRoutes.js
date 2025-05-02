const express = require('express');
const Goal = require('../models/Goals');
const authenticate = require('../middleware/Authenticate');

const router = express.Router();

// Input validation middleware
const validateGoal = (req, res, next) => {
  const { goal, category } = req.body;
  
  if (!goal || !category) {
    return res.status(400).json({
      success: false,
      error: 'Goal and category are required.'
    });
  }

  if (goal.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Goal cannot be empty.'
    });
  }

  next();
};

router.post('/add-goal', authenticate, validateGoal, async (req, res) => {
  try {
    const { goal, category, completed = false } = req.body;

    const newGoal = new Goal({
      user: req.user.userId,
      goal,
      category,
      completed
    });

    const savedGoal = await newGoal.save();
    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goal: savedGoal
    });
  } catch (err) {
    console.error('Error saving goal:', err);
    res.status(500).json({
      success: false,
      error: 'Error creating goal. Please try again.'
    });
  }
});

router.get('/get-goals', authenticate, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Goals retrieved successfully',
      goals
    });
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({
      success: false,
      error: 'Error fetching goals. Please try again.'
    });
  }
});

router.patch('/toggle-goal/:id', authenticate, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Goal ID is required.'
      });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.userId });
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found or unauthorized.'
      });
    }

    goal.completed = !goal.completed;
    const updatedGoal = await goal.save();

    res.status(200).json({
      success: true,
      message: updatedGoal.completed ? 'Goal marked as completed.' : 'Goal marked as incomplete.',
      goal: updatedGoal
    });
  } catch (err) {
    console.error('Error toggling goal completion:', err);
    res.status(500).json({
      success: false,
      error: 'Error updating goal. Please try again.'
    });
  }
});

router.delete('/delete-goal/:id', authenticate, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Goal ID is required.'
      });
    }

    const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedGoal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found or unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
      goal: deletedGoal
    });
  } catch (err) {
    console.error('Error deleting goal:', err);
    res.status(500).json({
      success: false,
      error: 'Error deleting goal. Please try again.'
    });
  }
});

module.exports = router;