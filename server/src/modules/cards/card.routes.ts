import { Router } from 'express';
import { CardController } from './card.controller';
import { authenticateJwt } from '../../common/middleware/authMiddleware';
import { idempotencyMiddleware } from '../../common/middleware/idempotencyMiddleware';

const router = Router();

router.use(authenticateJwt);

router.post('/issue', CardController.issueCard);
router.get('/', CardController.getUserCards);
router.post('/status', CardController.toggleStatus);
router.post('/simulate-charge', idempotencyMiddleware, CardController.simulateSpendAuthorization);

export const cardRoutes = router;
