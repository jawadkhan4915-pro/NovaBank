import React from 'react';
import { VirtualBankCard } from './VirtualBankCard';

interface TiltCardProps {
  cardId?: string;
  cardType?: string;
  maskedPan?: string;
  cardholderName?: string;
  expiryMonth?: number | string;
  expiryYear?: number | string;
  cvc?: string;
  status?: string;
  className?: string;
  isDemo?: boolean;
  requireAuth?: boolean;
  onTapChip?: () => void;
  onSuccess?: () => void;
}

/**
 * TiltCard - Renders an interactive Virtual Bank Card
 * featuring an EMV Bank Chip, Contactless Wave Icon, CVC security number,
 * NovaBank branding, and interactive Shopping Mall POS Terminal Scanner.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  cardId,
  cardType = 'Virtual Visa',
  maskedPan = '4111 8920 4821 9821',
  cardholderName = 'ALEX VANCE',
  expiryMonth = '08',
  expiryYear = '28',
  cvc = '849',
  status = 'ACTIVE',
  className = '',
  isDemo = false,
  requireAuth = true,
  onTapChip,
  onSuccess,
}) => {
  return (
    <VirtualBankCard
      cardId={cardId}
      cardType={cardType}
      maskedPan={maskedPan}
      cardholderName={cardholderName}
      expiryMonth={expiryMonth}
      expiryYear={expiryYear}
      cvc={cvc}
      status={status}
      className={className}
      isDemo={isDemo}
      requireAuth={requireAuth}
      onTapChip={onTapChip}
      onSuccess={onSuccess}
    />
  );
};
