import mongoose from 'mongoose';

const goalNoteSchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true }, // "2026-07"
  goals: { type: [String], default: [] },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('GoalNote', goalNoteSchema);
