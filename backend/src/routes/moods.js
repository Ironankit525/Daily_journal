import { Router } from 'express';
import MoodEntry from '../models/MoodEntry.js';
import MoodLabel from '../models/MoodLabel.js';

const router = Router();

// GET /api/moods?month=2026-07
router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: 'month query param required' });

  const entries = await MoodEntry.find({
    date: { $regex: `^${month}` },
  }).sort({ date: 1 });
  res.json(entries);
});

// PUT /api/moods — upsert mood for a day
router.put('/', async (req, res) => {
  const { date, level } = req.body;
  if (!date || level === undefined) {
    return res.status(400).json({ error: 'date and level required' });
  }

  // If level is -1, delete the entry (deselect)
  if (level === -1) {
    await MoodEntry.findOneAndDelete({ date });
    return res.json({ deleted: true });
  }

  const entry = await MoodEntry.findOneAndUpdate(
    { date },
    { level },
    { upsert: true, new: true }
  );
  res.json(entry);
});

// GET /api/mood-labels
router.get('/labels', async (req, res) => {
  let doc = await MoodLabel.findOne();
  if (!doc) {
    doc = await MoodLabel.create({});
  }
  res.json(doc);
});

// PUT /api/mood-labels
router.put('/labels', async (req, res) => {
  const { labels } = req.body;
  if (!Array.isArray(labels) || labels.length !== 6) {
    return res.status(400).json({ error: 'labels must be an array of 6 strings' });
  }

  let doc = await MoodLabel.findOne();
  if (!doc) {
    doc = await MoodLabel.create({ labels });
  } else {
    doc.labels = labels;
    await doc.save();
  }
  res.json(doc);
});

export default router;
