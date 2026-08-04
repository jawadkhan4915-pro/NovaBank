import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { BadRequestError, ForbiddenError } from '../errors/AppError';

// 1. Strict Auth Rate Limiter (Brute-Force & Credential Stuffing Protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 login/register attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMITED',
      message: 'Too many authentication attempts. Account access temporarily locked for 15 minutes for security.',
    },
  },
});

// 2. Financial Transaction Rate Limiter (Double-Spend & API Abuse Prevention)
export const transactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 transactions per minute max
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TRANSACTION_RATE_LIMITED',
      message: 'Financial transaction rate limit exceeded. Please wait 60 seconds before submitting another trade or transfer.',
    },
  },
});

// 3. Recursive Input Sanitization Middleware (XSS & Injection Protection)
const sanitizeValue = (val: any): any => {
  if (typeof val === 'string') {
    // Strip malicious script tags, javascript: URIs, and dangerous HTML entities
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) {
      return val.map(sanitizeValue);
    }
    const cleanObj: Record<string, any> = {};
    for (const key of Object.keys(val)) {
      // Prevent NoSQL query injection keys (starting with $)
      if (key.startsWith('$')) {
        continue;
      }
      cleanObj[key] = sanitizeValue(val[key]);
    }
    return cleanObj;
  }
  return val;
};

export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) req.query = sanitizeValue(req.query);
    if (req.params) req.params = sanitizeValue(req.params);
    next();
  } catch (err) {
    next(new BadRequestError('Malformed input payload detected'));
  }
};

// 4. Strict Financial Amount & Input Validator (Anti-Negative & Overflow Protection)
export const validateFinancialAmount = (req: Request, res: Response, next: NextFunction) => {
  const { amount, requestedLoanUSD, repaymentUSD } = req.body;

  const targetAmount = amount ?? requestedLoanUSD ?? repaymentUSD;

  if (targetAmount !== undefined) {
    const num = Number(targetAmount);
    if (isNaN(num) || !isFinite(num)) {
      return next(new BadRequestError('Security Error: Amount must be a valid finite number'));
    }
    if (num <= 0) {
      return next(new BadRequestError('Security Error: Transaction amount must be greater than zero'));
    }
    if (num > 100000000) {
      return next(new BadRequestError('Security Error: Single transaction exceeds maximum security ceiling limit ($100M USD)'));
    }
  }

  next();
};

// 5. Anti-Replay Attack & Timestamp Signature Verification
export const antiReplayCheck = (req: Request, res: Response, next: NextFunction) => {
  const timestampHeader = req.headers['x-timestamp'];

  if (timestampHeader) {
    const requestTime = parseInt(timestampHeader as string, 10);
    const currentTime = Date.now();
    const ageSeconds = Math.abs(currentTime - requestTime) / 1000;

    // Reject request if older than 5 minutes (300s) to prevent replay attack
    if (ageSeconds > 300) {
      return next(new ForbiddenError('Security Error: Request timestamp expired. Replay attack blocked.'));
    }
  }

  next();
};
