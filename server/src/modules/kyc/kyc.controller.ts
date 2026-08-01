import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/middleware/authMiddleware';
import { KycService } from './kyc.service';
import { ApiResponse, KycStatus } from '@novabank/shared';

export class KycController {
  public static async submitKyc(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { documentType, documentNumber } = req.body;

      const record = await KycService.submitKyc(userId, documentType, documentNumber);
      const response: ApiResponse<typeof record> = {
        success: true,
        data: record,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const record = await KycService.getStatus(userId);
      const response: ApiResponse<typeof record> = {
        success: true,
        data: record,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async reviewKyc(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { recordId, status, notes } = req.body as { recordId: string; status: KycStatus; notes?: string };
      const record = await KycService.reviewKyc(recordId, status, notes);

      const response: ApiResponse<typeof record> = {
        success: true,
        data: record,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getPending(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const records = await KycService.getPendingReviews();
      const response: ApiResponse<typeof records> = {
        success: true,
        data: records,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}
