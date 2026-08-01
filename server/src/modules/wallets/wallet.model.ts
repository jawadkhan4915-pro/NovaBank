import mongoose, { Schema, Document } from 'mongoose';
import { CryptoCurrency } from '@novabank/shared';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  depositAddresses: Map<CryptoCurrency, string>;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    depositAddresses: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
