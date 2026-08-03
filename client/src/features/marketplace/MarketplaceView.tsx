import React from 'react';
import { ShoppingBag, TrendingUp, Sparkles, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { CryptoCurrency } from '@novabank/shared';

interface MarketplaceViewProps {
  balances: Record<string, number>;
  onOpenConvertModal: () => void;
  onOpenMarketplaceModal: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  balances,
  onOpenConvertModal,
  onOpenMarketplaceModal,
}) => {
  const stakingProducts = [
    { symbol: 'BTC', name: 'Bitcoin Vault Staking', apy: '6.5%', locked: 'Flexible', bg: 'from-gold/10 to-transparent' },
    { symbol: 'ETH', name: 'Ethereum 2.0 Yield Pool', apy: '8.2%', locked: 'Flexible', bg: 'from-violet/10 to-transparent' },
    { symbol: 'SOL', name: 'Solana High-Yield Vault', apy: '12.4%', locked: '30 Days', bg: 'from-violet/10 to-transparent' },
    { symbol: 'BNB', name: 'BNB Smart Chain Pool', apy: '7.8%', locked: 'Flexible', bg: 'from-gold/10 to-transparent' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Staking & Yield Marketplace
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-semibold font-mono">
              Up to 12.4% APY
            </span>
          </h1>
          <p className="text-xs text-ink-muted">Earn passive yields on your crypto holdings or purchase luxury assets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenConvertModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet/20 text-violet border border-violet/30 text-xs font-bold hover:bg-violet/30 transition-all"
          >
            <ArrowRightLeft className="h-4 w-4" /> Swap & Convert
          </button>
          <button
            onClick={onOpenMarketplaceModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
          >
            <ShoppingBag className="h-4 w-4" /> Open Product Shop
          </button>
        </div>
      </div>

      {/* Yield Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stakingProducts.map((p) => (
          <div
            key={p.symbol}
            className={`glass-card rounded-2xl p-5 border border-glass-border bg-gradient-to-br ${p.bg} flex flex-col justify-between space-y-4 hover:border-gold/40 transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-sm text-ink">{p.symbol} Vault</span>
              <span className="px-2.5 py-0.5 rounded-full bg-success/20 text-success text-xs font-mono font-bold border border-success/30">
                {p.apy} APY
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-ink">{p.name}</div>
              <div className="text-xs text-ink-muted mt-0.5 font-mono">Term: {p.locked}</div>
            </div>

            <button
              onClick={onOpenConvertModal}
              className="w-full py-2 rounded-xl bg-surface hover:bg-surface-hover text-ink font-bold text-xs transition-all border border-glass-border text-center"
            >
              Deposit & Stake {p.symbol}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
