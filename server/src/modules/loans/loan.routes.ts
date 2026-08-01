import { Router } from 'express';
import { LoanController } from './loan.controller';
import { authenticateJwt } from '../../common/middleware/authMiddleware';
import { idempotencyMiddleware } from '../../common/middleware/idempotencyMiddleware';

const router = Router();

router.use(authenticateJwt);

router.post('/apply', idempotencyMiddleware, LoanController.requestLoan);
router.get('/', LoanController.getUserLoans);
router.post('/repay', idempotencyMiddleware, LoanController.repayLoan);

export const loanRoutes = router;
