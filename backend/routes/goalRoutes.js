const express = require('express');
const Goal = require('../models/Goals');
const authenticate = require('../middleware/Authenticate');

const router = express.Router();

router.post('/add-goal', authenticate, async (req, res) => {
    try {
      const { goal, category, completed = false } = req.body;
      if (!goal || !category) {
        return res.status(400).json({ error: 'Goal and category are required.' });
      }
  
      const newGoal = new Goal({
        user: req.user.userId,
        goal,
        category,
        completed
      });
  
      await newGoal.save();
      res.status(201).json(newGoal);
    } catch (err) {
      console.error('Error saving goal:', err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
  
  // Get goals
  router.get('/get-goals', authenticate, async (req, res) => {
    try {
      const goals = await Goal.find({ user: req.user.userId });
      res.status(200).json(goals);
    } catch (err) {
      console.error('Error fetching goals:', err);
      res.status(500).json({ error: 'Something went wrong while fetching goals.' });
    }
  });
  
  // Toggle goal
  router.patch('/toggle-goal/:id', authenticate, async (req, res) => {
    try {
      const goal = await Goal.findOne({ _id: req.params.id, user: req.user.userId });
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found or unauthorized.' });
      }
  
      goal.completed = !goal.completed;
      await goal.save();
  
      res.status(200).json({
        message: goal.completed ? 'Goal marked as completed.' : 'Goal marked as incomplete.',
        goal
      });
    } catch (err) {
      console.error('Error toggling goal completion:', err);
      res.status(500).json({ error: 'Something went wrong while updating the goal.' });
    }
  });
  
  // Delete goal
  router.delete('/delete-goal/:id', authenticate, async (req, res) => {
    try {
      const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
      if (!deletedGoal) {
        return res.status(404).json({ error: 'Goal not found or unauthorized.' });
      }
  
      res.status(200).json({ message: 'Goal deleted successfully.', goal: deletedGoal });
    } catch (err) {
      console.error('Error deleting goal:', err);
      res.status(500).json({ error: 'Something went wrong while deleting the goal.' });
    }
  });

  
module.exports = router;