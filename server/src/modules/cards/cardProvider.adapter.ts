import { CardType } from '@novabank/shared';

export interface IssueCardResult {
  providerCardId: string;
  maskedPan: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface ICardProviderAdapter {
  issueCard(cardType: CardType, cardholderName: string): Promise<IssueCardResult>;
  freezeCard(providerCardId: string): Promise<boolean>;
  unfreezeCard(providerCardId: string): Promise<boolean>;
}

export class MockCardProviderAdapter implements ICardProviderAdapter {
  public async issueCard(cardType: CardType, cardholderName: string): Promise<IssueCardResult> {
    // Generate mock card numbers
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    const maskedPan = cardType === 'VIRTUAL' ? `4890 •••• •••• ${last4}` : `5412 •••• •••• ${last4}`;
    
    const now = new Date();
    const expYear = (now.getFullYear() + 3).toString().slice(-2);
    const expMonth = ('0' + (now.getMonth() + 1)).slice(-2);

    return {
      providerCardId: `provider_card_${Date.now()}`,
      maskedPan,
      expiryMonth: expMonth,
      expiryYear: expYear,
    };
  }

  public async freezeCard(providerCardId: string): Promise<boolean> {
    return true;
  }

  public async unfreezeCard(providerCardId: string): Promise<boolean> {
    return true;
  }
}
