import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/middleware/authMiddleware';
import { WalletService } from './wallet.service';
import { ApiResponse, CryptoCurrency } from '@novabank/shared';

export class WalletController {
  public static async getWalletSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const wallet = await WalletService.getOrCreateWallet(userId);
      const balances = await WalletService.getBalances(userId);

      // Convert deposit addresses Map to plain object
      const depositAddressesObj: Record<string, string> = {};
      wallet.depositAddresses.forEach((val, key) => {
        depositAddressesObj[key] = val;
      });

      const response: ApiResponse<any> = {
        success: true,
        data: {
          userId,
          balances,
          depositAddresses: depositAddressesObj,
        },
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async simulateDeposit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { currency, amount } = req.body as { currency: CryptoCurrency; amount: number };
      const result = await WalletService.simulateDeposit(userId, currency, Number(amount));
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async withdraw(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { currency, amount, destinationAddress, bankAccountDetails } = req.body;
      const result = await WalletService.processWithdrawal({
        userId,
        currency,
        amount: Number(amount),
        destinationAddress,
        bankAccountDetails,
      });

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async transfer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const senderUserId = req.user!.userId;
      const { recipientIdentifier, currency, amount, note } = req.body;
      const result = await WalletService.processTransfer({
        senderUserId,
        recipientIdentifier,
        currency,
        amount: Number(amount),
        note,
      });

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getTransactionHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const history = await WalletService.getTransactionHistory(userId);

      const response: ApiResponse<typeof history> = {
        success: true,
        data: history,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}
