import mongoose, { Schema, Document } from 'mongoose';
import { CryptoCurrency } from '@novabank/shared';

export interface IProduct extends Document {
  title: string;
  description: string;
  priceUSD: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priceUSD: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

export interface IMarketplaceOrder extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  priceUSD: number;
  paidCurrency: CryptoCurrency;
  paidAmountCrypto: number;
  exchangeRate: number;
  status: string;
  createdAt: Date;
}

const MarketplaceOrderSchema = new Schema<IMarketplaceOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productTitle: { type: String, required: true },
    priceUSD: { type: Number, required: true },
    paidCurrency: { type: String, required: true, enum: ['BTC', 'ETH', 'BNB', 'SOL', 'BCH'] },
    paidAmountCrypto: { type: Number, required: true },
    exchangeRate: { type: Number, required: true },
    status: { type: String, default: 'COMPLETED' },
  },
  { timestamps: true }
);

export const MarketplaceOrder = mongoose.model<IMarketplaceOrder>('MarketplaceOrder', MarketplaceOrderSchema);
