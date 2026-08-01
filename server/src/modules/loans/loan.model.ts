import mongoose, { Schema, Document } from 'mongoose';
import { CryptoCurrency, LoanStatus } from '@novabank/shared';

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId;
  collateralAsset: CryptoCurrency;
  collateralAmount: number;
  collateralValueAtOriginationUSD: number;
  disbursedAmountUSD: number;
  currentLtvRatio: number;
  status: LoanStatus;
  repaidAmountUSD: number;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collateralAsset: { type: String, required: true, enum: ['BTC', 'ETH', 'BNB', 'SOL', 'BCH'] },
    collateralAmount: { type: Number, required: true, min: 0 },
    collateralValueAtOriginationUSD: { type: Number, required: true },
    disbursedAmountUSD: { type: Number, required: true },
    currentLtvRatio: { type: Number, required: true },
    status: { type: String, enum: ['ACTIVE', 'REPAID', 'LIQUIDATED', 'MARGIN_CALL'], default: 'ACTIVE' },
    repaidAmountUSD: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Loan = mongoose.model<ILoan>('Loan', LoanSchema);
