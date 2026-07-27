import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// GET /auth/me
router.get('/me', async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Auth/me error:', err);
    res.status(500).json({ error: err.message || 'Auth check failed' });
  }
});

// PUT /auth/change-password
router.put('/change-password', async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: err.message || 'Password change failed' });
  }
});

export default router;
