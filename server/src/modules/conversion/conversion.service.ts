import { CryptoCurrency, LockedQuote } from '@novabank/shared';
import { AppError, NotFoundError } from '../../common/errors/AppError';
import { WalletService } from '../wallets/wallet.service';
import { v4 as uuidv4 } from 'uuid';

// In-memory quote store (15 second TTL)
const quoteStore = new Map<string, LockedQuote>();

export class ConversionService {
  // Base market rates in USD (fallback/mock for dev)
  private static mockRates: Record<CryptoCurrency, number> = {
    BTC: 65000.0,
    ETH: 3500.0,
    BNB: 580.0,
    SOL: 145.0,
    BCH: 450.0,
  };

  public static getLiveRates(): Record<CryptoCurrency, number> {
    return { ...this.mockRates };
  }

  public static async createQuote(
    userId: string,
    fromCurrency: CryptoCurrency,
    fromAmount: number
  ): Promise<LockedQuote> {
    if (fromAmount <= 0) {
      throw new AppError('Amount must be greater than zero', 400);
    }

    const rates = this.getLiveRates();
    const rate = rates[fromCurrency];
    if (!rate) {
      throw new NotFoundError(`Rate not available for ${fromCurrency}`);
    }

    const toAmountUSD = Math.round(fromAmount * rate * 100) / 100;
    const feeUSD = 0; // 0 conversion fee promotional
    const quoteId = `quote_${uuidv4()}`;
    const expiresAt = Date.now() + 15000; // 15s window

    const quote: LockedQuote = {
      quoteId,
      fromCurrency,
      toCurrency: 'USD',
      fromAmount,
      toAmountUSD,
      exchangeRate: rate,
      feeUSD,
      expiresAt,
    };

    quoteStore.set(quoteId, quote);

    return quote;
  }

  public static async executeConversion(userId: string, quoteId: string, idempotencyKey?: string) {
    const quote = quoteStore.get(quoteId);
    if (!quote) {
      throw new AppError('Quote expired or invalid', 400, 'QUOTE_EXPIRED');
    }

    if (Date.now() > quote.expiresAt) {
      quoteStore.delete(quoteId);
      throw new AppError('Quote locked rate has expired. Please request a new quote.', 400, 'QUOTE_EXPIRED');
    }

    // Delete quote so it cannot be reused
    quoteStore.delete(quoteId);

    const refId = `conv_${uuidv4()}`;

    // 1. Debit Crypto
    await WalletService.recordLedgerEntry({
      userId,
      currency: quote.fromCurrency,
      amount: quote.fromAmount,
      type: 'debit',
      refType: 'CONVERSION_DEBIT',
      refId,
      idempotencyKey: idempotencyKey ? `${idempotencyKey}_debit` : undefined,
    });

    // 2. Credit USD
    await WalletService.recordLedgerEntry({
      userId,
      currency: 'USD',
      amount: quote.toAmountUSD,
      type: 'credit',
      refType: 'CONVERSION_CREDIT',
      refId,
      idempotencyKey: idempotencyKey ? `${idempotencyKey}_credit` : undefined,
    });

    return {
      message: 'Conversion completed successfully',
      refId,
      convertedFrom: `${quote.fromAmount} ${quote.fromCurrency}`,
      receivedUSD: quote.toAmountUSD,
      rateUsed: quote.exchangeRate,
    };
  }
}
