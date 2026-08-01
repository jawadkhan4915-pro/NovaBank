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
    { symbol: 'BTC', name: 'Bitcoin Vault Staking', apy: '6.5%', locked: 'Flexible', bg: 'from-amber-500/10 to-amber-900/10' },
    { symbol: 'ETH', name: 'Ethereum 2.0 Yield Pool', apy: '8.2%', locked: 'Flexible', bg: 'from-indigo-500/10 to-indigo-900/10' },
    { symbol: 'SOL', name: 'Solana High-Yield Vault', apy: '12.4%', locked: '30 Days', bg: 'from-emerald-500/10 to-emerald-900/10' },
    { symbol: 'BNB', name: 'BNB Smart Chain Pool', apy: '7.8%', locked: 'Flexible', bg: 'from-yellow-500/10 to-yellow-900/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Staking & Yield Marketplace
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-aurora-emerald/20 text-aurora-emerald border border-aurora-emerald/30 font-semibold">
              Up to 12.4% APY
            </span>
          </h1>
          <p className="text-xs text-slate-400">Earn passive yields on your crypto holdings or purchase luxury assets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenConvertModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-aurora-violet/20 text-aurora-violet border border-aurora-violet/30 text-xs font-bold hover:bg-aurora-violet/30 transition-all"
          >
            <ArrowRightLeft className="h-4 w-4" /> Swap & Convert
          </button>
          <button
            onClick={onOpenMarketplaceModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white text-xs font-bold hover:opacity-90 transition-all shadow-md"
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
            className={`glass-card rounded-3xl p-5 border border-white/15 bg-gradient-to-br ${p.bg} flex flex-col justify-between space-y-4 hover:border-aurora-cyan/40 transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-white">{p.symbol} Vault</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                {p.apy} APY
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-200">{p.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Term: {p.locked}</div>
            </div>

            <button
              onClick={onOpenConvertModal}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/10 text-center"
            >
              Deposit & Stake {p.symbol}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
