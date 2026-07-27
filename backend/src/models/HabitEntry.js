import mongoose from 'mongoose';

const habitEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  status: {
    type: String,
    enum: ['done', 'missed', 'partial', 'none'],
    default: 'none',
  },
  note: { type: String, default: '' },
}, { timestamps: true });

habitEntrySchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('HabitEntry', habitEntrySchema);
