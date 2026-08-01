import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
app.use(helmet());
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

// Error Handler
app.use(errorHandler);

export default app;
