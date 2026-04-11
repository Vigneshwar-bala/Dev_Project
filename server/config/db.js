import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast — 5s max
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`\n✅ MongoDB Handshake Successful!`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}\n`);
  } catch (error) {
    isConnected = false;
    console.error(`\n❌ MongoDB Connection Failed: ${error.message}`);
    console.error(`⚠️  Running in OFFLINE MODE — watchlist & cache will use in-memory storage.`);
    console.error(`💡 Fix: MongoDB Atlas → Network Access → Add IP 0.0.0.0/0\n`);
  }
};

export const getConnectionStatus = () => isConnected;

export default connectDB;
