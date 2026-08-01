import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/middleware/authMiddleware';
import { LoanService } from './loan.service';
import { ApiResponse, CryptoCurrency } from '@novabank/shared';

export class LoanController {
  public static async requestLoan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { collateralAsset, collateralAmount, requestedLoanUSD } = req.body as {
        collateralAsset: CryptoCurrency;
        collateralAmount: number;
        requestedLoanUSD: number;
      };

      const loan = await LoanService.requestLoan(userId, collateralAsset, Number(collateralAmount), Number(requestedLoanUSD));
      
      const response: ApiResponse<typeof loan> = {
        success: true,
        data: loan,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserLoans(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const loans = await LoanService.getUserLoans(userId);

      const response: ApiResponse<typeof loans> = {
        success: true,
        data: loans,
      };
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async repayLoan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { loanId, repaymentUSD } = req.body;

      const result = await LoanService.repayLoan(userId, loanId, Number(repaymentUSD));
      
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
