import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import habitsRouter from './routes/habits.js';
import habitEntriesRouter from './routes/habitEntries.js';
import moodsRouter from './routes/moods.js';
import goalsNotesRouter from './routes/goalsNotes.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Strip duplicate /api prefix if present in Vercel serverless requests
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.substring(4); // e.g. /api/auth/login -> /auth/login
  }
  next();
});

// Routes
app.use('/auth', authRouter);
app.use('/habits', habitsRouter);
app.use('/habit-entries', habitEntriesRouter);
app.use('/moods', moodsRouter);
app.use('/goals-notes', goalsNotesRouter);

// Health check
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    dbState: process.env.MONGO_URI || process.env.MONGODB_URI ? 'Atlas URI Configured' : 'Missing MONGO_URI',
    timestamp: new Date().toISOString(),
  });
});

// JSON 404 Fallback for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl || req.url}` });
});

// Global Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Local dev server listener
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Backend running on http://localhost:${PORT}`);
    });
  });
}

export default app;
