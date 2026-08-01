import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateJwt } from '../../common/middleware/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authenticateJwt, AuthController.getMe);
router.post('/2fa/setup', authenticateJwt, AuthController.generate2FA);
router.post('/2fa/verify', authenticateJwt, AuthController.verify2FA);

export const authRoutes = router;
