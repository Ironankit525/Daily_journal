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

// Ensure MongoDB Atlas connection for serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes supporting both /api/* and direct /* (for Vercel serverless routing)
app.use('/api/auth', authRouter);
app.use('/auth', authRouter);

app.use('/api/habits', habitsRouter);
app.use('/habits', habitsRouter);

app.use('/api/habit-entries', habitEntriesRouter);
app.use('/habit-entries', habitEntriesRouter);

app.use('/api/moods', moodsRouter);
app.use('/moods', moodsRouter);

app.use('/api/goals-notes', goalsNotesRouter);
app.use('/goals-notes', goalsNotesRouter);

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    dbState: process.env.MONGO_URI || process.env.MONGODB_URI ? 'Atlas URI Configured' : 'Missing MONGO_URI',
    timestamp: new Date().toISOString(),
  });
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
