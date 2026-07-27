import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const existing = await User.findOne({ username: username.toLowerCase() });
  if (existing) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const user = await User.create({
    username: username.toLowerCase(),
    password,
  });

  res.status(201).json({
    user: { id: user._id, username: user.username },
    token: `token-${user._id}`,
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({
    user: { id: user._id, username: user.username },
    token: `token-${user._id}`,
  });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = authHeader.replace('Bearer token-', '');
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({ user: { id: user._id, username: user.username } });
});

// PUT /api/auth/change-password
router.put('/change-password', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = authHeader.replace('Bearer token-', '');
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password required' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.password !== currentPassword) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

export default router;
