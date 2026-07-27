import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-tracker';
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✓ MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
  }
};

export default connectDB;
