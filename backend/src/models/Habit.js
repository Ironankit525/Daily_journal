import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  month: { type: String, required: true }, // "2026-07"
}, { timestamps: true });

habitSchema.index({ userId: 1, month: 1, order: 1 });

export default mongoose.model('Habit', habitSchema);
