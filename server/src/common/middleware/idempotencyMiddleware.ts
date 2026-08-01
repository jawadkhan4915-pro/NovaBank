import { Request, Response, NextFunction } from 'express';

// Simple in-memory cache for Idempotency keys (production can use Redis)
interface IdempotencyRecord {
  statusCode: number;
  body: any;
  timestamp: number;
}

const idempotencyStore = new Map<string, IdempotencyRecord>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const idempotencyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    return next();
  }

  // Clean expired keys occasionally
  const now = Date.now();
  if (idempotencyStore.has(idempotencyKey)) {
    const record = idempotencyStore.get(idempotencyKey)!;
    if (now - record.timestamp < IDEMPOTENCY_TTL_MS) {
      console.log(`[Idempotency] Returning cached response for key: ${idempotencyKey}`);
      return res.status(record.statusCode).json(record.body);
    } else {
      idempotencyStore.delete(idempotencyKey);
    }
  }

  // Intercept res.json to cache response
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(idempotencyKey, {
        statusCode: res.statusCode,
        body,
        timestamp: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
};
