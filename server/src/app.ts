import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { errorHandler } from './common/middleware/errorHandler';
import {
  authLimiter,
  transactionLimiter,
  xssSanitizer,
  validateFinancialAmount,
  antiReplayCheck,
} from './common/middleware/securityMiddleware';

import { authRoutes } from './modules/auth/auth.routes';
import { walletRoutes } from './modules/wallets/wallet.routes';
import { conversionRoutes } from './modules/conversion/conversion.routes';
import { cardRoutes } from './modules/cards/card.routes';
import { loanRoutes } from './modules/loans/loan.routes';
import { marketplaceRoutes } from './modules/marketplace/marketplace.routes';
import { kycRoutes } from './modules/kyc/kyc.routes';

const app = express();

// Disable x-powered-by header to conceal stack details from scanners
app.disable('x-powered-by');

// 1. Comprehensive Helmet Security Headers (Clickjacking, HSTS, XSS, Sniffing protection)
app.use(
  helmet({
    contentSecurityPolicy: false, // Set false to allow custom inline SVGs and canvas particles
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }, // Anti-clickjacking: Prevents embedding in unauthorized iframe
    noSniff: true, // X-Content-Type-Options: nosniff
    xssFilter: true, // X-XSS-Protection: 1; mode=block
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // HTTP Strict Transport Security
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// 2. Hardened CORS Policy
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Idempotency-Key',
      'X-Timestamp',
      'X-Nonce',
      'X-Tx-Signature',
    ],
  })
);

// 3. Body Parser with 10MB payload size limit (Anti Large-Payload DoS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Global Input XSS & Parameter Sanitization Middleware
app.use(xssSanitizer);

// 5. Anti-Replay Timestamp Header Check
app.use(antiReplayCheck);

// 6. Global Fallback Rate Limiter (300 requests / 15 min per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP. Please wait before retrying.',
    },
  },
});
app.use(globalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'NovaBank API',
    securityMode: 'HARDENED_AES256_MULTI_SIG',
    timestamp: new Date().toISOString(),
  });
});

// API Routes with Tiered Security Protections
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/conversion', transactionLimiter, validateFinancialAmount, conversionRoutes);
app.use('/api/v1/cards', transactionLimiter, cardRoutes);
app.use('/api/v1/loans', transactionLimiter, validateFinancialAmount, loanRoutes);
app.use('/api/v1/marketplace', transactionLimiter, marketplaceRoutes);
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

// Error Handler Middleware
app.use(errorHandler);

export default app;
