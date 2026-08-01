import { FeeService } from '../modules/conversion/fee.service';

describe('FeeService Business Rules', () => {
  test('Card transaction fee for <= $500 should be $0.10', () => {
    expect(FeeService.calculateCardTransactionFee(50)).toBe(0.10);
    expect(FeeService.calculateCardTransactionFee(500)).toBe(0.10);
  });

  test('Card transaction fee for $500.01 to $1000 should be $0.50', () => {
    expect(FeeService.calculateCardTransactionFee(500.01)).toBe(0.50);
    expect(FeeService.calculateCardTransactionFee(750)).toBe(0.50);
    expect(FeeService.calculateCardTransactionFee(1000)).toBe(0.50);
  });

  test('Card transaction fee for > $1000 should be $1.00', () => {
    expect(FeeService.calculateCardTransactionFee(1000.01)).toBe(1.00);
    expect(FeeService.calculateCardTransactionFee(2500)).toBe(1.00);
  });

  test('Loan repayment flat fee should be $1.00', () => {
    expect(FeeService.getLoanRepaymentFee()).toBe(1.00);
  });
});
