import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { authenticateJwt } from '../../common/middleware/authMiddleware';
import { idempotencyMiddleware } from '../../common/middleware/idempotencyMiddleware';

const router = Router();

router.use(authenticateJwt);

router.get('/summary', WalletController.getWalletSummary);
router.get('/history', WalletController.getTransactionHistory);
router.post('/deposit/simulate', idempotencyMiddleware, WalletController.simulateDeposit);
router.post('/withdraw', idempotencyMiddleware, WalletController.withdraw);
router.post('/transfer', idempotencyMiddleware, WalletController.transfer);

export const walletRoutes = router;
