// Supported Currencies
export type CryptoCurrency = 'BTC' | 'ETH' | 'BNB' | 'SOL' | 'BCH';
export type FiatCurrency = 'USD';
export type Currency = CryptoCurrency | FiatCurrency;

// User Roles & KYC
export type UserRole = 'USER' | 'ADMIN' | 'COMPLIANCE_OFFICER';
export type KycStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  kycStatus: KycStatus;
  isTwoFactorEnabled: boolean;
  hasPasskey: boolean;
  bankIdNumber: string;
  referralCode: string;
  referredBy?: string;
  referralEarningsUSD?: number;
  createdAt: string;
  updatedAt: string;
}

export interface KycSubmissionRequest {
  cnicNumber: string;
  cnicFrontBase64?: string;
  cnicBackBase64?: string;
  phoneSimVerifiedName: string;
  faceScanBase64?: string;
}

// Double-Entry Ledger
export type LedgerEntryType = 'debit' | 'credit';

export type LedgerRefType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'CONVERSION_DEBIT'
  | 'CONVERSION_CREDIT'
  | 'CARD_SPEND'
  | 'CARD_FEE'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_COLLATERAL_LOCK'
  | 'LOAN_REPAYMENT'
  | 'LOAN_REPAYMENT_FEE'
  | 'LOAN_LIQUIDATION'
  | 'MARKETPLACE_PURCHASE'
  | 'P2P_TRANSFER'
  | 'REFERRAL_REWARD';

export interface LedgerEntry {
  id: string;
  userId: string;
  walletId: string;
  currency: Currency;
  amount: number;
  type: LedgerEntryType;
  refType: LedgerRefType;
  refId: string;
  idempotencyKey?: string;
  createdAt: string;
}

// Wallet Sub-balances
export interface BalanceMap {
  USD: number;
  BTC: number;
  ETH: number;
  BNB: number;
  SOL: number;
  BCH: number;
}

export interface WalletSummary {
  userId: string;
  balances: BalanceMap;
  depositAddresses: Record<CryptoCurrency, string>;
  totalEstimatedUsdValue: number;
}

// Conversion Quotes
export interface LockedQuote {
  quoteId: string;
  fromCurrency: CryptoCurrency;
  toCurrency: FiatCurrency;
  fromAmount: number;
  toAmountUSD: number;
  exchangeRate: number; // e.g. 1 BTC = 65,000 USD
  feeUSD: number;
  expiresAt: number; // timestamp in ms (15s TTL)
}

// Cards
export type CardType = 'VIRTUAL' | 'PHYSICAL';
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'TERMINATED';

export interface CardDetails {
  id: string;
  userId: string;
  cardType: CardType;
  cardholderName: string;
  maskedPan: string; // e.g. "4111 **** **** 1234"
  expiryMonth: string;
  expiryYear: string;
  status: CardStatus;
  spendLimitDailyUSD: number;
  spentTodayUSD: number;
  createdAt: string;
}

export interface CardTransactionRequest {
  cardId: string;
  amountUSD: number;
  merchantName: string;
  merchantCategory: string;
}

export interface CardTransactionResponse {
  approved: boolean;
  transactionId?: string;
  amountUSD: number;
  feeAppliedUSD: number;
  totalDebitedUSD: number;
  reason?: string;
}

// Loans
export type LoanStatus = 'ACTIVE' | 'REPAID' | 'LIQUIDATED' | 'MARGIN_CALL';

export interface LoanDetails {
  id: string;
  userId: string;
  collateralAsset: CryptoCurrency;
  collateralAmount: number;
  collateralValueAtOriginationUSD: number;
  currentCollateralValueUSD: number;
  disbursedAmountUSD: number;
  currentLtvRatio: number; // e.g. 0.45 for 45%
  status: LoanStatus;
  repaidAmountUSD: number;
  createdAt: string;
}

// Marketplace
export interface Product {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

export interface MarketplaceOrder {
  id: string;
  userId: string;
  productId: string;
  productTitle: string;
  priceUSD: number;
  paidCurrency: CryptoCurrency;
  paidAmountCrypto: number;
  exchangeRate: number;
  status: 'COMPLETED' | 'FAILED';
  createdAt: string;
}

// Fee Engine Table
export interface FeeRules {
  cardSpendFeeSmall: number; // $0.10 for <= $500
  cardSpendFeeMedium: number; // $0.50 for $500.01 - $1000
  cardSpendFeeLarge: number; // $1.00 for > $1000
  loanRepaymentFee: number; // $1.00 flat
}

export const DEFAULT_FEE_RULES: FeeRules = {
  cardSpendFeeSmall: 0.10,
  cardSpendFeeMedium: 0.50,
  cardSpendFeeLarge: 1.00,
  loanRepaymentFee: 1.00,
};

// Standard API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
