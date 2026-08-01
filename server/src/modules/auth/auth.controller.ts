import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../common/middleware/authMiddleware';
import { ApiResponse } from '@novabank/shared';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, phone } = req.body;
      const result = await AuthService.register({ email, password, fullName, phone });
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, twoFactorCode } = req.body;
      const result = await AuthService.login({ email, password, twoFactorCode });
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async generate2FA(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await AuthService.generate2FA(userId);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async verify2FA(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { token } = req.body;
      const result = await AuthService.verify2FA(userId, token);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}
