import { Loan } from './loan.model';
import { CryptoCurrency } from '@novabank/shared';
import { AppError, NotFoundError, InsufficientBalanceError } from '../../common/errors/AppError';
import { ConversionService } from '../conversion/conversion.service';
import { FeeService } from '../conversion/fee.service';
import { WalletService } from '../wallets/wallet.service';
import { v4 as uuidv4 } from 'uuid';

export class LoanService {
  public static MAX_LTV_RATIO = 0.50; // 50% max LTV at origination

  public static async requestLoan(
    userId: string,
    collateralAsset: CryptoCurrency,
    collateralAmount: number,
    requestedLoanUSD: number
  ) {
    if (collateralAmount <= 0 || requestedLoanUSD <= 0) {
      throw new AppError('Amounts must be greater than zero', 400);
    }

    const rates = ConversionService.getLiveRates();
    const rate = rates[collateralAsset];
    if (!rate) throw new NotFoundError(`Rate not available for ${collateralAsset}`);

    const collateralValueUSD = Math.round(collateralAmount * rate * 100) / 100;
    const computedLtv = Math.round((requestedLoanUSD / collateralValueUSD) * 1000) / 1000;

    if (computedLtv > this.MAX_LTV_RATIO) {
      throw new AppError(
        `Requested loan exceeds max allowed 50% LTV ratio. Current calculated LTV: ${(computedLtv * 100).toFixed(1)}%`,
        400,
        'LTV_EXCEEDED'
      );
    }

    const refId = `loan_orig_${uuidv4()}`;

    // 1. Lock Crypto Collateral from user wallet (debit)
    await WalletService.recordLedgerEntry({
      userId,
      currency: collateralAsset,
      amount: collateralAmount,
      type: 'debit',
      refType: 'LOAN_COLLATERAL_LOCK',
      refId,
    });

    // 2. Disburse USD into user wallet (credit)
    await WalletService.recordLedgerEntry({
      userId,
      currency: 'USD',
      amount: requestedLoanUSD,
      type: 'credit',
      refType: 'LOAN_DISBURSEMENT',
      refId,
    });

    const loan = await Loan.create({
      userId,
      collateralAsset,
      collateralAmount,
      collateralValueAtOriginationUSD: collateralValueUSD,
      disbursedAmountUSD: requestedLoanUSD,
      currentLtvRatio: computedLtv,
      status: 'ACTIVE',
      repaidAmountUSD: 0,
    });

    return loan;
  }

  public static async getUserLoans(userId: string) {
    return await Loan.find({ userId }).sort({ createdAt: -1 });
  }

  public static async repayLoan(userId: string, loanId: string, repaymentUSD: number) {
    const loan = await Loan.findOne({ _id: loanId, userId });
    if (!loan) throw new NotFoundError('Loan not found');

    if (loan.status === 'REPAID' || loan.status === 'LIQUIDATED') {
      throw new AppError(`Loan is already ${loan.status}`, 400);
    }

    const remainingBalance = loan.disbursedAmountUSD - loan.repaidAmountUSD;
    const actualRepayment = Math.min(repaymentUSD, remainingBalance);

    // Apply flat $1.00 fee per fee rules
    const feeUSD = FeeService.getLoanRepaymentFee();
    const totalRequiredUSD = actualRepayment + feeUSD;

    const balances = await WalletService.getBalances(userId);
    if (balances.USD < totalRequiredUSD) {
      throw new InsufficientBalanceError(
        `Insufficient USD balance. Required: $${totalRequiredUSD} ($${actualRepayment} repayment + $${feeUSD} fee), Available: $${balances.USD}`
      );
    }

    const refId = `loan_repay_${uuidv4()}`;

    // 1. Debit USD Repayment
    await WalletService.recordLedgerEntry({
      userId,
      currency: 'USD',
      amount: actualRepayment,
      type: 'debit',
      refType: 'LOAN_REPAYMENT',
      refId,
    });

    // 2. Debit USD Repayment Fee ($1.00)
    await WalletService.recordLedgerEntry({
      userId,
      currency: 'USD',
      amount: feeUSD,
      type: 'debit',
      refType: 'LOAN_REPAYMENT_FEE',
      refId,
    });

    // 3. Proportional collateral release
    const releaseRatio = actualRepayment / loan.disbursedAmountUSD;
    const collateralToRelease = Math.round(loan.collateralAmount * releaseRatio * 100000000) / 100000000;

    await WalletService.recordLedgerEntry({
      userId,
      currency: loan.collateralAsset,
      amount: collateralToRelease,
      type: 'credit',
      refType: 'DEPOSIT',
      refId: `${refId}_release`,
    });

    loan.repaidAmountUSD = Math.round((loan.repaidAmountUSD + actualRepayment) * 100) / 100;
    if (loan.repaidAmountUSD >= loan.disbursedAmountUSD) {
      loan.status = 'REPAID';
      loan.currentLtvRatio = 0;
    }

    await loan.save();

    return {
      message: 'Loan repayment successful',
      repaidUSD: actualRepayment,
      feeAppliedUSD: feeUSD,
      collateralReleased: collateralToRelease,
      collateralAsset: loan.collateralAsset,
      loanStatus: loan.status,
    };
  }
}
