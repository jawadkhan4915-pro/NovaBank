import mongoose, { Schema, Document } from 'mongoose';
import { CardType, CardStatus } from '@novabank/shared';

export interface ICard extends Document {
  userId: mongoose.Types.ObjectId;
  cardType: CardType;
  cardholderName: string;
  maskedPan: string;
  expiryMonth: string;
  expiryYear: string;
  status: CardStatus;
  spendLimitDailyUSD: number;
  spentTodayUSD: number;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cardType: { type: String, enum: ['VIRTUAL', 'PHYSICAL'], required: true },
    cardholderName: { type: String, required: true },
    maskedPan: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'FROZEN', 'TERMINATED'], default: 'ACTIVE' },
    spendLimitDailyUSD: { type: Number, default: 2500 },
    spentTodayUSD: { type: Number, default: 0 },
    shippingAddress: { type: String },
  },
  { timestamps: true }
);

export const Card = mongoose.model<ICard>('Card', CardSchema);
