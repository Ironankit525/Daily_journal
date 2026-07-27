import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  let uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-tracker';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✓ MongoDB Atlas connected successfully');
  } catch (err) {
    console.warn('Primary MongoDB URI failed, attempting clean URI fallback:', err.message);
    if (uri.includes('%26') || uri.includes('&')) {
      const cleanUri = uri.replace(/\/T%26T|\/T&T/gi, '/TT');
      try {
        await mongoose.connect(cleanUri, { serverSelectionTimeoutMS: 5000 });
        isConnected = true;
        console.log('✓ MongoDB Atlas connected via clean URI fallback');
        return;
      } catch (fallbackErr) {
        throw new Error(`Database connection failed: ${fallbackErr.message}`);
      }
    }
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

export default connectDB;
