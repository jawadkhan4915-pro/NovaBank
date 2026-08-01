import { Router } from 'express';
import { KycController } from './kyc.controller';
import { authenticateJwt, requireRole } from '../../common/middleware/authMiddleware';

const router = Router();

router.use(authenticateJwt);

router.post('/submit', KycController.submitKyc);
router.get('/status', KycController.getStatus);
router.get('/pending', requireRole('ADMIN', 'COMPLIANCE_OFFICER'), KycController.getPending);
router.post('/review', requireRole('ADMIN', 'COMPLIANCE_OFFICER'), KycController.reviewKyc);

export const kycRoutes = router;
