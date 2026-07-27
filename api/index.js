import app from '../backend/src/server.js';
import connectDB from '../backend/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Vercel serverless DB connect error:', err);
  }

  return new Promise((resolve) => {
    app(req, res, (err) => {
      if (err) {
        res.status(500).json({ error: err.message || 'Server error' });
      }
      resolve();
    });
  });
}
