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
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serverless DB connection middleware
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/habit-entries', habitEntriesRouter);
app.use('/api/moods', moodsRouter);
app.use('/api/goals-notes', goalsNotesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server if run directly
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
