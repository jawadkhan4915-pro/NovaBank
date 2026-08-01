import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/middleware/authMiddleware';
import { ConversionService } from './conversion.service';
import { ApiResponse, CryptoCurrency } from '@novabank/shared';

export class ConversionController {
  public static async getLiveRates(req: Request, res: Response, next: NextFunction) {
    try {
      const rates = ConversionService.getLiveRates();
      const response: ApiResponse<typeof rates> = {
        success: true,
        data: rates,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async requestQuote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { fromCurrency, amount } = req.body as { fromCurrency: CryptoCurrency; amount: number };
      const quote = await ConversionService.createQuote(userId, fromCurrency, Number(amount));
      
      const response: ApiResponse<typeof quote> = {
        success: true,
        data: quote,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async executeConversion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { quoteId } = req.body;
      const idempotencyKey = req.headers['idempotency-key'] as string;
      const result = await ConversionService.executeConversion(userId, quoteId, idempotencyKey);
      
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
