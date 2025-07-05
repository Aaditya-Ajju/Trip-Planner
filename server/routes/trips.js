import express from 'express';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all user trips
router.get('/', authenticateToken, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get specific trip
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Create new trip
router.post('/', authenticateToken, async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      userId: req.user.uid
    };

    const trip = new Trip(tripData);
    await trip.save();

    // Update user stats
    await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $inc: { 'stats.tripsPlanned': 1 } }
    );

    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Update trip
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete trip
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Update user stats
    await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $inc: { 'stats.tripsPlanned': -1 } }
    );

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export default router;