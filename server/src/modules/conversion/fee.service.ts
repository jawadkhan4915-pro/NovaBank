import { DEFAULT_FEE_RULES } from '@novabank/shared';

export class FeeService {
  /**
   * Calculates card spend authorization fee based on exact business rules:
   * - $0 - $500: $0.10 flat
   * - $500.01 - $1000: $0.50 flat
   * - > $1000: $1.00 flat
   */
  public static calculateCardTransactionFee(amountUSD: number): number {
    if (amountUSD <= 0) return 0;
    if (amountUSD <= 500) {
      return DEFAULT_FEE_RULES.cardSpendFeeSmall;
    } else if (amountUSD <= 1000) {
      return DEFAULT_FEE_RULES.cardSpendFeeMedium;
    } else {
      return DEFAULT_FEE_RULES.cardSpendFeeLarge;
    }
  }

  /**
   * Loan repayment flat fee ($1.00)
   */
  public static getLoanRepaymentFee(): number {
    return DEFAULT_FEE_RULES.loanRepaymentFee;
  }
}
