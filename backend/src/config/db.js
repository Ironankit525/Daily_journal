import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-tracker';
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✓ MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

export default connectDB;
