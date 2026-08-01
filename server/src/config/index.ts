import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/novabank',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_novabank_jwt_key_2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super_secret_novabank_refresh_key_2026',
  jwtExpiresIn: '15m',
  jwtRefreshExpiresIn: '7d',
  encryptionKey: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // 32 bytes hex
};
