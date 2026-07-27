import { Router } from 'express';
import GoalNote from '../models/GoalNote.js';

const router = Router();

// GET /api/goals-notes?month=2026-07
router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: 'month query param required' });

  let doc = await GoalNote.findOne({ month });
  if (!doc) {
    doc = { month, goals: [], notes: '' };
  }
  res.json(doc);
});

// PUT /api/goals-notes
router.put('/', async (req, res) => {
  const { month, goals, notes } = req.body;
  if (!month) return res.status(400).json({ error: 'month required' });

  const doc = await GoalNote.findOneAndUpdate(
    { month },
    { goals: goals || [], notes: notes || '' },
    { upsert: true, new: true }
  );
  res.json(doc);
});

export default router;
