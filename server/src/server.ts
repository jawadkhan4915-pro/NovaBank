import mongoose from 'mongoose';
import app from './app';
import { config } from './config';

const startServer = async () => {
  app.listen(config.port, () => {
    console.log(`🚀 [NovaBank Server] Listening on http://localhost:${config.port}`);
  });

  try {
    console.log('[NovaBank Server] Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[NovaBank Server] Connected to MongoDB successfully.');
  } catch (err: any) {
    console.warn('[NovaBank Server] MongoDB connection failed or timed out:', err.message || err);
    console.warn('[NovaBank Server] Operating in memory-mock mode for dev testing.');
  }
};

startServer();
