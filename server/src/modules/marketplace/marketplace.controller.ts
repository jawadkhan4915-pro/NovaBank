import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/middleware/authMiddleware';
import { MarketplaceService } from './marketplace.service';
import { ApiResponse, CryptoCurrency } from '@novabank/shared';

export class MarketplaceController {
  public static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await MarketplaceService.getProducts();
      const response: ApiResponse<typeof products> = {
        success: true,
        data: products,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async checkout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { productId, paidCurrency } = req.body as { productId: string; paidCurrency: CryptoCurrency };

      const order = await MarketplaceService.checkout(userId, productId, paidCurrency);
      const response: ApiResponse<typeof order> = {
        success: true,
        data: order,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const orders = await MarketplaceService.getUserOrders(userId);
      const response: ApiResponse<typeof orders> = {
        success: true,
        data: orders,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}
