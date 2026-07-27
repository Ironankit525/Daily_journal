import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer token-')) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const userId = authHeader.replace('Bearer token-', '');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }

    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
