import React from 'react';
import { VirtualBankCard } from './VirtualBankCard';

interface TiltCardProps {
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
}

/**
 * TiltCard - Now rendering a clean, professional, non-animated Virtual Bank Card
 * featuring an authentic EMV Bank Chip, Contactless Icon, CVC security number,
 * NovaBank branding, and front/back toggle.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
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
}) => {
  return (
    <VirtualBankCard
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
    />
  );
};
