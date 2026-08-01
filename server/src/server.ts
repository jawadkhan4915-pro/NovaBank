import mongoose from 'mongoose';
import app from './app';
import { config } from './config';

const startServer = async () => {
  try {
    console.log('[NovaBank Server] Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('[NovaBank Server] Connected to MongoDB successfully.');
  } catch (err) {
    console.warn('[NovaBank Server] MongoDB connection failed or timed out. Operating in memory-mock mode for dev testing.');
  }

  app.listen(config.port, () => {
    console.log(`🚀 [NovaBank Server] Listening on http://localhost:${config.port}`);
  });
};

startServer();
