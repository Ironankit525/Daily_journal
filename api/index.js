import app from '../backend/src/server.js';
import connectDB from '../backend/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('Serverless connection error:', err);
    return res.status(500).json({ error: `Serverless DB Connection Error: ${err.message}` });
  }
}
