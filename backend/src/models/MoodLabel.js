import mongoose from 'mongoose';

const moodLabelSchema = new mongoose.Schema({
  labels: {
    type: [String],
    default: ['Happy', 'Neutral', 'Sad', 'Stressed', 'Tired', 'Overwhelmed'],
  },
});

export default mongoose.model('MoodLabel', moodLabelSchema);
