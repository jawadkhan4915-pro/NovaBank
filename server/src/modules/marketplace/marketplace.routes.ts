import { Router } from 'express';
import { MarketplaceController } from './marketplace.controller';
import { authenticateJwt } from '../../common/middleware/authMiddleware';
import { idempotencyMiddleware } from '../../common/middleware/idempotencyMiddleware';

const router = Router();

router.get('/products', MarketplaceController.getProducts);
router.post('/checkout', authenticateJwt, idempotencyMiddleware, MarketplaceController.checkout);
router.get('/orders', authenticateJwt, MarketplaceController.getUserOrders);

export const marketplaceRoutes = router;
