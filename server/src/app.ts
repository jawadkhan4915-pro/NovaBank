import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { errorHandler } from './common/middleware/errorHandler';
import { authRoutes } from './modules/auth/auth.routes';
import { walletRoutes } from './modules/wallets/wallet.routes';
import { conversionRoutes } from './modules/conversion/conversion.routes';
import { cardRoutes } from './modules/cards/card.routes';
import { loanRoutes } from './modules/loans/loan.routes';
import { marketplaceRoutes } from './modules/marketplace/marketplace.routes';
import { kycRoutes } from './modules/kyc/kyc.routes';

const app = express();

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests' } },
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'NovaBank API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/conversion', conversionRoutes);
app.use('/api/v1/cards', cardRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/kyc', kycRoutes);

// Static Client Serving & SPA Fallback (Single Port Mode)
const possibleClientPaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
];

const clientDistPath = possibleClientPaths.find((p) => fs.existsSync(p));

if (clientDistPath) {
  console.log(`[NovaBank Server] Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

export default app;
