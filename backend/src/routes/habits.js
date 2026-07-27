import { Router } from 'express';
import Habit from '../models/Habit.js';
import HabitEntry from '../models/HabitEntry.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const DEFAULT_HABITS = [
  'Wake up before 6:00 AM',
  'Exercise / Meditation',
  'Study 5hr+',
  'No Junk / Sugar',
  '1 hr New Skill',
  "Read Author's book",
  'Drink 2-3 L H2O',
  'Bkp - 1 - Math video',
  'Bkp - 1 - Eng. video',
  'Read Eng. Editorial',
  'Current affairs.',
  'Feel gratitude',
  'No Phone B4 Bed (1/2 hr)',
  'Sleep Before 11:00 PM.',
];

router.use(authMiddleware);

// GET /api/habits?month=2026-07 (Scoped to logged-in user)
router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: 'month query param required' });

  let habits = await Habit.find({ userId: req.userId, month }).sort({ order: 1 });

  if (habits.length === 0) {
    const seedDocs = DEFAULT_HABITS.map((name, index) => ({
      userId: req.userId,
      name,
      month,
      order: index,
    }));
    habits = await Habit.insertMany(seedDocs);
  }

  res.json(habits);
});

// POST /api/habits (Scoped to logged-in user)
router.post('/', async (req, res) => {
  const { name, month } = req.body;
  if (!name || !month) return res.status(400).json({ error: 'name and month required' });

  const lastHabit = await Habit.findOne({ userId: req.userId, month }).sort({ order: -1 });
  const order = lastHabit ? lastHabit.order + 1 : 0;

  const habit = await Habit.create({
    userId: req.userId,
    name,
    month,
    order,
  });
  res.status(201).json(habit);
});

// PUT /api/habits/:id (Scoped to logged-in user)
router.put('/:id', async (req, res) => {
  const { name, order } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (order !== undefined) update.order = order;

  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    update,
    { new: true }
  );
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  res.json(habit);
});

// DELETE /api/habits/:id (Scoped to logged-in user)
router.delete('/:id', async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!habit) return res.status(404).json({ error: 'Habit not found' });

  await HabitEntry.deleteMany({ userId: req.userId, habitId: req.params.id });
  res.json({ success: true });
});

export default router;
