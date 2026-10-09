import mongoose from 'mongoose';

let isConnected = false;
let connectionMode = 'disconnected';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/festivo';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500, // Quick timeout check
    });

    isConnected = true;
    connectionMode = 'mongodb';
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}\x1b[0m`);
    return { success: true, mode: 'mongodb', host: conn.connection.host };
  } catch (error) {
    console.warn(`\x1b[33m⚠ Real MongoDB could not be reached at ${mongoURI}.\x1b[0m`);
    console.warn(`\x1b[36mℹ Operating in resilient In-Memory Mongo Mock Mode so that all 16 pages, auth, and CRUD function seamlessly.\x1b[0m`);
    console.warn(`\x1b[36mℹ To connect real MongoDB: Set MONGO_URI in backend/.env to your MongoDB Atlas or local MongoDB connection string.\x1b[0m`);
    
    isConnected = false;
    connectionMode = 'in-memory-mock';
    return { success: false, mode: 'in-memory-mock', error: error.message };
  }
};

export const getDBStatus = () => {
  return {
    isConnected,
    mode: connectionMode,
    configuredUri: process.env.MONGO_URI ? 'Configured in .env' : 'Default localhost',
    mongooseReadyState: mongoose.connection.readyState
  };
};
