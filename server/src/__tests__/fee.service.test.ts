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

  test('Withdrawal fee schedule: <=$500 ($0.10), $500.01-$1000 ($0.50), >$1000 ($1.00)', () => {
    expect(FeeService.calculateWithdrawalFee(250)).toBe(0.10);
    expect(FeeService.calculateWithdrawalFee(500)).toBe(0.10);
    expect(FeeService.calculateWithdrawalFee(750)).toBe(0.50);
    expect(FeeService.calculateWithdrawalFee(1000)).toBe(0.50);
    expect(FeeService.calculateWithdrawalFee(1500)).toBe(1.00);
  });

  test('P2P Transfer fee schedule: <=$500 ($0.10), $500.01-$1000 ($0.50), >$1000 ($1.00)', () => {
    expect(FeeService.calculateTransferFee(100)).toBe(0.10);
    expect(FeeService.calculateTransferFee(500)).toBe(0.10);
    expect(FeeService.calculateTransferFee(800)).toBe(0.50);
    expect(FeeService.calculateTransferFee(1000)).toBe(0.50);
    expect(FeeService.calculateTransferFee(3000)).toBe(1.00);
  });

  test('Loan repayment flat fee should be $1.00', () => {
    expect(FeeService.getLoanRepaymentFee()).toBe(1.00);
  });
});
