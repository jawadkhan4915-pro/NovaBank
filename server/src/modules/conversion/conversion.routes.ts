import { Router } from 'express';
import { ConversionController } from './conversion.controller';
import { authenticateJwt } from '../../common/middleware/authMiddleware';
import { idempotencyMiddleware } from '../../common/middleware/idempotencyMiddleware';

const router = Router();

router.get('/rates', ConversionController.getLiveRates);
router.post('/quote', authenticateJwt, ConversionController.requestQuote);
router.post('/execute', authenticateJwt, idempotencyMiddleware, ConversionController.executeConversion);

export const conversionRoutes = router;
