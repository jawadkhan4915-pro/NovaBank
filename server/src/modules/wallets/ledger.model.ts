import mongoose, { Schema, Document } from 'mongoose';
import { Currency, LedgerEntryType, LedgerRefType } from '@novabank/shared';

export interface ILedgerEntry extends Document {
  userId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  currency: Currency;
  amount: number;
  type: LedgerEntryType;
  refType: LedgerRefType;
  refId: string;
  idempotencyKey?: string;
  createdAt: Date;
}

const LedgerEntrySchema = new Schema<ILedgerEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
    currency: { type: String, required: true, enum: ['USD', 'BTC', 'ETH', 'BNB', 'SOL', 'BCH'] },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ['debit', 'credit'] },
    refType: {
      type: String,
      required: true,
      enum: [
        'DEPOSIT',
        'WITHDRAWAL',
        'CONVERSION_DEBIT',
        'CONVERSION_CREDIT',
        'CARD_SPEND',
        'CARD_FEE',
        'LOAN_DISBURSEMENT',
        'LOAN_COLLATERAL_LOCK',
        'LOAN_REPAYMENT',
        'LOAN_REPAYMENT_FEE',
        'LOAN_LIQUIDATION',
        'MARKETPLACE_PURCHASE',
        'P2P_TRANSFER',
      ],
    },
    refId: { type: String, required: true },
    idempotencyKey: { type: String, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LedgerEntry = mongoose.model<ILedgerEntry>('LedgerEntry', LedgerEntrySchema);
