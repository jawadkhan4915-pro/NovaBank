import { Card } from './card.model';
import { MockCardProviderAdapter } from './cardProvider.adapter';
import { CardType, CardStatus, CardTransactionResponse } from '@novabank/shared';
import { AppError, NotFoundError, InsufficientBalanceError } from '../../common/errors/AppError';
import { FeeService } from '../conversion/fee.service';
import { WalletService } from '../wallets/wallet.service';
import { v4 as uuidv4 } from 'uuid';

const cardAdapter = new MockCardProviderAdapter();

export class CardService {
  public static async issueCard(userId: string, cardType: CardType, cardholderName: string, shippingAddress?: string) {
    const cardData = await cardAdapter.issueCard(cardType, cardholderName);

    const card = await Card.create({
      userId,
      cardType,
      cardholderName,
      maskedPan: cardData.maskedPan,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      status: 'ACTIVE',
      spendLimitDailyUSD: 2500,
      spentTodayUSD: 0,
      shippingAddress,
    });

    return card;
  }

  public static async getUserCards(userId: string) {
    return await Card.find({ userId }).sort({ createdAt: -1 });
  }

  public static async toggleCardStatus(userId: string, cardId: string, status: CardStatus) {
    const card = await Card.findOne({ _id: cardId, userId });
    if (!card) throw new NotFoundError('Card not found');

    card.status = status;
    await card.save();

    return card;
  }

  public static async authorizeCardTransaction(
    cardId: string,
    amountUSD: number,
    merchantName: string
  ): Promise<CardTransactionResponse> {
    const card = await Card.findById(cardId);
    if (!card) {
      return { approved: false, amountUSD, feeAppliedUSD: 0, totalDebitedUSD: 0, reason: 'Card not found' };
    }

    if (card.status !== 'ACTIVE') {
      return { approved: false, amountUSD, feeAppliedUSD: 0, totalDebitedUSD: 0, reason: `Card is ${card.status}` };
    }

    // Calculate fee using FeeService
    const feeAppliedUSD = FeeService.calculateCardTransactionFee(amountUSD);
    const totalDebitedUSD = Math.round((amountUSD + feeAppliedUSD) * 100) / 100;

    // Check user USD balance
    const balances = await WalletService.getBalances(card.userId.toString());
    if (balances.USD < totalDebitedUSD) {
      return {
        approved: false,
        amountUSD,
        feeAppliedUSD,
        totalDebitedUSD,
        reason: `Insufficient USD balance. Required: $${totalDebitedUSD}, Available: $${balances.USD}`,
      };
    }

    const txRefId = `card_tx_${uuidv4()}`;

    // Perform double-entry debit: amountUSD (CARD_SPEND) and feeAppliedUSD (CARD_FEE)
    await WalletService.recordLedgerEntry({
      userId: card.userId.toString(),
      currency: 'USD',
      amount: amountUSD,
      type: 'debit',
      refType: 'CARD_SPEND',
      refId: txRefId,
    });

    if (feeAppliedUSD > 0) {
      await WalletService.recordLedgerEntry({
        userId: card.userId.toString(),
        currency: 'USD',
        amount: feeAppliedUSD,
        type: 'debit',
        refType: 'CARD_FEE',
        refId: txRefId,
      });
    }

    card.spentTodayUSD = Math.round((card.spentTodayUSD + amountUSD) * 100) / 100;
    await card.save();

    return {
      approved: true,
      transactionId: txRefId,
      amountUSD,
      feeAppliedUSD,
      totalDebitedUSD,
    };
  }
}
