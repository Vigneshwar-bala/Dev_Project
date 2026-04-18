import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

const connectDB = async () => {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      // Mask URI for logging (hide password)
      const maskedUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:(.*?)(@|\/)/, ':****$1$2') : 'undefined';
      console.log(`\n🔄 MongoDB Connect Attempt ${attempt + 1}/${maxRetries} | URI: ${maskedUri}`);
      
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      
      isConnected = true;
      console.log(`\n✅ MongoDB Handshake Successful!`);
      console.log(`📦 Database: ${conn.connection.name}`);
      console.log(`🌐 Host: ${conn.connection.host}`);
      if (process.env.MONGO_URI) {
        try {
          console.log(`🔗 URI Host: ${new URL(process.env.MONGO_URI).host}`);
        } catch {
          console.log(`🔗 URI Host: local`);
        }
      }
      return conn; // Success, exit loop
    } catch (error) {
      attempt++;
      isConnected = false;
      console.error(`\n❌ Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt >= maxRetries) {
        console.error(`\n⚠️  All ${maxRetries} attempts failed. Running in OFFLINE MODE (in-memory storage).`);
        console.error(`💡 Troubleshooting:`);
        console.error(`   • Verify MONGO_URI (creds, whitelist IP 0.0.0.0/0)`);
        console.error(`   • Network/VPN/firewall allows Atlas connection`);
        console.error(`   • Test: npx mongoose-cli connect <your-uri>`);
      } else {
        console.log(`⏳ Retrying in 10s...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }
};

export const getConnectionStatus = () => isConnected;

export default connectDB;
