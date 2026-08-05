import mongoose from 'mongoose';
import { Wallet } from './wallet.model';
import { LedgerEntry } from './ledger.model';
import { User } from '../auth/user.model';
import { FeeService } from '../conversion/fee.service';
import { BalanceMap, CryptoCurrency, Currency, LedgerEntryType, LedgerRefType } from '@novabank/shared';
import { AppError, InsufficientBalanceError, NotFoundError } from '../../common/errors/AppError';
import { v4 as uuidv4 } from 'uuid';

export class WalletService {
  public static async getOrCreateWallet(userId: string) {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      // Generate initial deposit addresses for supported crypto assets
      const depositAddresses = new Map<CryptoCurrency, string>([
        ['BTC', `bc1q${uuidv4().replace(/-/g, '').slice(0, 32)}`],
        ['ETH', `0x${uuidv4().replace(/-/g, '').slice(0, 40)}`],
        ['BNB', `bnb1${uuidv4().replace(/-/g, '').slice(0, 32)}`],
        ['SOL', `${uuidv4().replace(/-/g, '').slice(0, 44)}`],
        ['BCH', `bitcoincash:q${uuidv4().replace(/-/g, '').slice(0, 32)}`],
      ]);

      wallet = await Wallet.create({
        userId,
        depositAddresses,
      });
    }
    return wallet;
  }

  public static async getBalances(userId: string): Promise<BalanceMap> {
    const wallet = await this.getOrCreateWallet(userId);

    const aggregation = await LedgerEntry.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { currency: '$currency', type: '$type' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const balances: BalanceMap = {
      USD: 0,
      BTC: 0,
      ETH: 0,
      BNB: 0,
      SOL: 0,
      BCH: 0,
    };

    for (const item of aggregation) {
      const currency = item._id.currency as Currency;
      const type = item._id.type as LedgerEntryType;
      const amount = item.totalAmount;

      if (currency in balances) {
        if (type === 'credit') {
          balances[currency as keyof BalanceMap] += amount;
        } else if (type === 'debit') {
          balances[currency as keyof BalanceMap] -= amount;
        }
      }
    }

    // Rounding to 8 decimal places for crypto precision
    (Object.keys(balances) as (keyof BalanceMap)[]).forEach((curr) => {
      balances[curr] = Math.max(0, Math.round(balances[curr] * 100000000) / 100000000);
    });

    return balances;
  }

  public static async recordLedgerEntry(params: {
    userId: string;
    currency: Currency;
    amount: number;
    type: LedgerEntryType;
    refType: LedgerRefType;
    refId: string;
    idempotencyKey?: string;
  }) {
    const wallet = await this.getOrCreateWallet(params.userId);

    // If debit, check balance first
    if (params.type === 'debit') {
      const balances = await this.getBalances(params.userId);
      const currentBalance = balances[params.currency as keyof BalanceMap] || 0;
      if (currentBalance < params.amount) {
        throw new InsufficientBalanceError(
          `Insufficient ${params.currency} balance. Required: ${params.amount}, Available: ${currentBalance}`
        );
      }
    }

    const entry = await LedgerEntry.create({
      userId: new mongoose.Types.ObjectId(params.userId),
      walletId: wallet._id,
      currency: params.currency,
      amount: params.amount,
      type: params.type,
      refType: params.refType,
      refId: params.refId,
      idempotencyKey: params.idempotencyKey,
    });

    return entry;
  }

  public static async simulateDeposit(userId: string, currency: CryptoCurrency, amount: number) {
    if (amount <= 0) {
      throw new AppError('Deposit amount must be greater than zero', 400);
    }

    const refId = `dep_${uuidv4()}`;
    const entry = await this.recordLedgerEntry({
      userId,
      currency,
      amount,
      type: 'credit',
      refType: 'DEPOSIT',
      refId,
    });

    return {
      message: 'Deposit successful',
      transactionId: refId,
      currency,
      amount,
      entry,
    };
  }

  public static async processWithdrawal(params: {
    userId: string;
    currency: Currency;
    amount: number;
    destinationAddress?: string;
    bankAccountDetails?: string;
  }) {
    if (params.amount <= 0) {
      throw new AppError('Withdrawal amount must be greater than zero', 400);
    }

    const rates: Record<string, number> = { USD: 1, BTC: 65000, ETH: 3500, BNB: 580, SOL: 145, BCH: 450 };
    const rateUSD = rates[params.currency] || 1;
    const amountUSD = params.amount * rateUSD;

    // Calculate Fee using Fee Engine Tiered Schedule ($0.10 <= $500, $0.50 <= $1k, $1.00 > $1k)
    const feeAppliedUSD = FeeService.calculateWithdrawalFee(amountUSD);
    const feeInCurrency = params.currency === 'USD' ? feeAppliedUSD : Math.round((feeAppliedUSD / rateUSD) * 100000000) / 100000000;

    // Verify total balance available (amount + fee)
    const balances = await this.getBalances(params.userId);
    const currentBalance = balances[params.currency as keyof BalanceMap] || 0;
    if (currentBalance < params.amount + feeInCurrency) {
      throw new InsufficientBalanceError(
        `Insufficient ${params.currency} balance for withdrawal + fee. Total needed: ${(params.amount + feeInCurrency).toFixed(6)}, Available: ${currentBalance}`
      );
    }

    const refId = `wd_${uuidv4()}`;

    // 1. Record Withdrawal Debit
    await this.recordLedgerEntry({
      userId: params.userId,
      currency: params.currency,
      amount: params.amount,
      type: 'debit',
      refType: 'WITHDRAWAL',
      refId,
    });

    // 2. Record Withdrawal Fee Debit
    await this.recordLedgerEntry({
      userId: params.userId,
      currency: params.currency,
      amount: feeInCurrency,
      type: 'debit',
      refType: 'WITHDRAWAL_FEE',
      refId: `${refId}_fee`,
    });

    return {
      transactionId: refId,
      currency: params.currency,
      amount: params.amount,
      feeAppliedUSD,
      feeInCurrency,
      totalDebited: params.amount + feeInCurrency,
      destinationAddress: params.destinationAddress || params.bankAccountDetails || 'NovaBank Electronic Settlement',
    };
  }

  public static async processTransfer(params: {
    senderUserId: string;
    recipientIdentifier: string;
    currency: Currency;
    amount: number;
    note?: string;
  }) {
    if (params.amount <= 0) {
      throw new AppError('Transfer amount must be greater than zero', 400);
    }

    const recipient = await User.findOne({
      $or: [
        { email: params.recipientIdentifier.toLowerCase().trim() },
        { bankIdNumber: params.recipientIdentifier.trim() },
      ],
    });

    if (!recipient) {
      throw new NotFoundError(`Recipient '${params.recipientIdentifier}' not found in NovaBank ledger.`);
    }

    if (recipient._id.toString() === params.senderUserId) {
      throw new AppError('Cannot transfer funds to yourself.', 400);
    }

    const rates: Record<string, number> = { USD: 1, BTC: 65000, ETH: 3500, BNB: 580, SOL: 145, BCH: 450 };
    const rateUSD = rates[params.currency] || 1;
    const amountUSD = params.amount * rateUSD;

    // Calculate Fee using Fee Engine Tiered Schedule ($0.10 <= $500, $0.50 <= $1k, $1.00 > $1k)
    const feeAppliedUSD = FeeService.calculateTransferFee(amountUSD);
    const feeInCurrency = params.currency === 'USD' ? feeAppliedUSD : Math.round((feeAppliedUSD / rateUSD) * 100000000) / 100000000;

    // Verify Sender Balance
    const balances = await this.getBalances(params.senderUserId);
    const currentBalance = balances[params.currency as keyof BalanceMap] || 0;
    if (currentBalance < params.amount + feeInCurrency) {
      throw new InsufficientBalanceError(
        `Insufficient ${params.currency} balance for transfer + fee. Total needed: ${(params.amount + feeInCurrency).toFixed(6)}, Available: ${currentBalance}`
      );
    }

    const refId = `tx_${uuidv4()}`;

    // 1. Sender Debit Amount
    await this.recordLedgerEntry({
      userId: params.senderUserId,
      currency: params.currency,
      amount: params.amount,
      type: 'debit',
      refType: 'P2P_TRANSFER',
      refId,
    });

    // 2. Sender Debit Fee
    await this.recordLedgerEntry({
      userId: params.senderUserId,
      currency: params.currency,
      amount: feeInCurrency,
      type: 'debit',
      refType: 'P2P_TRANSFER_FEE',
      refId: `${refId}_fee`,
    });

    // 3. Recipient Credit Amount
    await this.recordLedgerEntry({
      userId: recipient._id.toString(),
      currency: params.currency,
      amount: params.amount,
      type: 'credit',
      refType: 'P2P_TRANSFER',
      refId,
    });

    return {
      transferId: refId,
      recipientName: recipient.fullName,
      recipientEmail: recipient.email,
      currency: params.currency,
      amount: params.amount,
      feeAppliedUSD,
      feeInCurrency,
      totalDebited: params.amount + feeInCurrency,
    };
  }

  public static async getTransactionHistory(userId: string) {
    const entries = await LedgerEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);

    return entries;
  }
}
