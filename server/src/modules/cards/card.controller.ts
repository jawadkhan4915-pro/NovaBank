import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/middleware/authMiddleware';
import { CardService } from './card.service';
import { ApiResponse, CardType, CardStatus } from '@novabank/shared';

export class CardController {
  public static async issueCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { cardType, cardholderName, shippingAddress } = req.body as {
        cardType: CardType;
        cardholderName: string;
        shippingAddress?: string;
      };

      const card = await CardService.issueCard(userId, cardType, cardholderName, shippingAddress);
      
      const response: ApiResponse<typeof card> = {
        success: true,
        data: card,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserCards(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const cards = await CardService.getUserCards(userId);

      const response: ApiResponse<typeof cards> = {
        success: true,
        data: cards,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async toggleStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { cardId, status } = req.body as { cardId: string; status: CardStatus };

      const card = await CardService.toggleCardStatus(userId, cardId, status);
      const response: ApiResponse<typeof card> = {
        success: true,
        data: card,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async simulateSpendAuthorization(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { cardId, amountUSD, merchantName } = req.body;
      const result = await CardService.authorizeCardTransaction(cardId, Number(amountUSD), merchantName || 'Online Merchant');

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
