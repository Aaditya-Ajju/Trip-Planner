import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Authorization header:', req.headers.authorization);
    console.log('Decoded user from token (req.user):', req.user);
    const user = await User.findOne({ firebaseUid: req.user.uid });
    console.log('User found in MongoDB:', user);
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    if (req.user.email_verified === false) {
      return res.status(403).json({ error: 'Email not verified. Please verify your email.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Create user profile
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('POST /profile body:', req.body);
    console.log('Decoded user from token (req.user):', req.user);
    const { displayName, email, photoURL } = req.body;
    const existingUser = await User.findOne({ firebaseUid: req.user.uid });
    if (existingUser) {
      console.log('User already exists:', existingUser);
      return res.status(400).json({ error: 'User profile already exists' });
    }
    const user = new User({
      firebaseUid: req.user.uid,
      email: email || req.user.email,
      displayName: displayName || req.user.name,
      photoURL: photoURL || req.user.picture || ''
    });
    await user.save();
    console.log('User created:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;