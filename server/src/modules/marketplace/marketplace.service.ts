import { Product, MarketplaceOrder } from './product.model';
import { CryptoCurrency } from '@novabank/shared';
import { AppError, NotFoundError } from '../../common/errors/AppError';
import { ConversionService } from '../conversion/conversion.service';
import { WalletService } from '../wallets/wallet.service';
import { v4 as uuidv4 } from 'uuid';

export class MarketplaceService {
  private static initialProducts = [
    {
      title: 'Ledger Flex Hardware Wallet',
      description: 'Next-gen touch screen secure cold storage hardware wallet.',
      priceUSD: 249.00,
      imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80',
      category: 'Security',
      inStock: true,
    },
    {
      title: 'MacBook Pro 16" M3 Max',
      description: 'Space Black 36GB RAM 1TB SSD ultimate developer machine.',
      priceUSD: 3499.00,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      inStock: true,
    },
    {
      title: 'Titanium Crypto Recovery Seed Plate',
      description: 'Fireproof & waterproof 6000°F rated seed phrase backup plate.',
      priceUSD: 79.00,
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80',
      category: 'Security',
      inStock: true,
    },
    {
      title: 'NovaBank Black VIP Founder Pass',
      description: 'Exclusive NFT membership tier with 0% loan origination fees and 2% cashback.',
      priceUSD: 1200.00,
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      category: 'VIP Membership',
      inStock: true,
    },
  ];

  public static async getProducts() {
    let count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(this.initialProducts);
    }
    return await Product.find();
  }

  public static async checkout(userId: string, productId: string, paidCurrency: CryptoCurrency) {
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    const rates = ConversionService.getLiveRates();
    const rate = rates[paidCurrency];
    if (!rate) throw new NotFoundError(`Live rate for ${paidCurrency} unavailable`);

    const paidAmountCrypto = Math.round((product.priceUSD / rate) * 100000000) / 100000000;

    const refId = `mkt_${uuidv4()}`;

    // Debit user crypto balance
    await WalletService.recordLedgerEntry({
      userId,
      currency: paidCurrency,
      amount: paidAmountCrypto,
      type: 'debit',
      refType: 'MARKETPLACE_PURCHASE',
      refId,
    });

    const order = await MarketplaceOrder.create({
      userId,
      productId: product._id,
      productTitle: product.title,
      priceUSD: product.priceUSD,
      paidCurrency,
      paidAmountCrypto,
      exchangeRate: rate,
      status: 'COMPLETED',
    });

    return order;
  }

  public static async getUserOrders(userId: string) {
    return await MarketplaceOrder.find({ userId }).sort({ createdAt: -1 });
  }
}
