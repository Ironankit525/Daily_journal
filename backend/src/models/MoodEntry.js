import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // "2026-07-15"
  level: { type: Number, required: true, min: 0, max: 5 },
}, { timestamps: true });

export default mongoose.model('MoodEntry', moodEntrySchema);
