import { Router } from 'express';
import HabitEntry from '../models/HabitEntry.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// GET /api/habit-entries?month=2026-07 (Scoped to logged-in user)
router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: 'month query param required' });

  const entries = await HabitEntry.find({
    userId: req.userId,
    date: { $regex: `^${month}` },
  });
  res.json(entries);
});

// PUT /api/habit-entries — upsert entry (Scoped to logged-in user)
router.put('/', async (req, res) => {
  const { habitId, date, status, note } = req.body;
  if (!habitId || !date || !status) {
    return res.status(400).json({ error: 'habitId, date, and status required' });
  }

  if (status === 'none') {
    await HabitEntry.findOneAndDelete({ userId: req.userId, habitId, date });
    return res.json({ deleted: true });
  }

  const entry = await HabitEntry.findOneAndUpdate(
    { userId: req.userId, habitId, date },
    { status, note: status === 'partial' ? (note || '') : '' },
    { upsert: true, new: true }
  );
  res.json(entry);
});

export default router;
