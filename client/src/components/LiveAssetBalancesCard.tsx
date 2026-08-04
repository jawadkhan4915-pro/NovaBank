import React, { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowRightLeft, TrendingUp, TrendingDown, Wallet, Zap, Plus } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { AnimatedCounter } from './AnimatedCounter';
import { CryptoCurrency } from '@novabank/shared';

interface LiveAssetBalancesCardProps {
  balances: Record<string, number>;
  onOpenModal: (modalName: string) => void;
  onRatesUpdated?: (rates: Record<string, number>) => void;
}

interface AssetDetail {
  symbol: string;
  name: string;
  priceUSD: number;
  change24h: number;
  iconBg: string;
  iconText: string;
  lastUpdateState?: 'up' | 'down' | null;
}

const INITIAL_ASSET_DATA: Record<string, AssetDetail> = {
  USD: {
    symbol: 'USD',
    name: 'US Dollar Reserve',
    priceUSD: 1.00,
    change24h: 0.00,
    iconBg: 'from-gold/30 to-gold/10 border-gold/40 text-gold',
    iconText: '$',
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUSD: 65420.50,
    change24h: 3.42,
    iconBg: 'from-gold/30 to-gold/10 border-gold/40 text-gold',
    iconText: '₿',
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    priceUSD: 3512.80,
    change24h: 4.85,
    iconBg: 'from-violet/30 to-violet/10 border-violet/40 text-violet',
    iconText: 'Ξ',
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    priceUSD: 148.60,
    change24h: 8.12,
    iconBg: 'from-violet/30 to-gold/10 border-violet/40 text-violet',
    iconText: '◎',
  },
  BNB: {
    symbol: 'BNB',
    name: 'BNB Chain',
    priceUSD: 584.20,
    change24h: -0.65,
    iconBg: 'from-gold/30 to-gold/10 border-gold/40 text-gold',
    iconText: '⬢',
  },
  BCH: {
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    priceUSD: 452.10,
    change24h: 1.75,
    iconBg: 'from-success/30 to-success/10 border-success/40 text-success',
    iconText: 'Ƀ',
  },
};

export const LiveAssetBalancesCard: React.FC<LiveAssetBalancesCardProps> = ({
  balances,
  onOpenModal,
  onRatesUpdated,
}) => {
  const [assetDetails, setAssetDetails] = useState<Record<string, AssetDetail>>(INITIAL_ASSET_DATA);

  // Live real-time market price updates & micro-ticks
  useEffect(() => {
    let isMounted = true;

    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,bitcoin-cash&vs_currencies=usd&include_24hr_change=true'
        );
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data) {
            const mapping: Record<string, string> = {
              bitcoin: 'BTC',
              ethereum: 'ETH',
              solana: 'SOL',
              binancecoin: 'BNB',
              'bitcoin-cash': 'BCH',
            };

            setAssetDetails((prev) => {
              const updated = { ...prev };
              Object.keys(mapping).forEach((geckoId) => {
                const sym = mapping[geckoId];
                if (data[geckoId] && updated[sym]) {
                  const newPrice = data[geckoId].usd;
                  const change = data[geckoId].usd_24h_change || updated[sym].change24h;
                  const diff = newPrice - updated[sym].priceUSD;
                  updated[sym] = {
                    ...updated[sym],
                    priceUSD: newPrice,
                    change24h: Math.round(change * 100) / 100,
                    lastUpdateState: diff > 0 ? 'up' : diff < 0 ? 'down' : null,
                  };
                }
              });
              return updated;
            });
          }
        }
      } catch (err) {
        // Silent catch
      }
    };

    fetchPrices();
    const fetchInterval = setInterval(fetchPrices, 15000);

    // Micro-tick jitter every 2.4s for real-time live activity feedback
    const jitterInterval = setInterval(() => {
      if (!isMounted) return;
      setAssetDetails((prev) => {
        const keys = ['BTC', 'ETH', 'SOL', 'BNB', 'BCH'];
        const randomSym = keys[Math.floor(Math.random() * keys.length)];
        const target = prev[randomSym];
        if (!target) return prev;

        const deltaPercent = (Math.random() * 0.36 - 0.16) / 100;
        const priceDelta = target.priceUSD * deltaPercent;
        const newPrice = Math.max(0.001, target.priceUSD + priceDelta);
        const state = priceDelta >= 0 ? 'up' : 'down';

        const formattedPrice =
          newPrice > 10
            ? Math.round(newPrice * 100) / 100
            : Math.round(newPrice * 1000) / 1000;

        return {
          ...prev,
          [randomSym]: {
            ...target,
            priceUSD: formattedPrice,
            lastUpdateState: state,
          },
        };
      });
    }, 2400);

    return () => {
      isMounted = false;
      clearInterval(fetchInterval);
      clearInterval(jitterInterval);
    };
  }, []);

  // Notify parent component of live rates
  useEffect(() => {
    if (onRatesUpdated) {
      const rates: Record<string, number> = {};
      Object.keys(assetDetails).forEach((sym) => {
        rates[sym] = assetDetails[sym].priceUSD;
      });
      onRatesUpdated(rates);
    }
  }, [assetDetails, onRatesUpdated]);

  return (
    <SpotlightCard className="p-5 space-y-4 rounded-2xl border border-glass-border">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gold/15 text-gold border border-gold/30">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
              Multi-Currency Asset Balances & Live Rates
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            </h3>
            <p className="text-[11px] text-ink-muted">Real-time market values reconciled in your private ledger</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenModal('deposit')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
          >
            <ArrowDownRight className="h-3.5 w-3.5" /> Deposit Assets
          </button>
          <button
            onClick={() => onOpenModal('convert')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet/20 hover:bg-violet/30 text-violet border border-violet/30 text-xs font-bold transition-all"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" /> Convert USD
          </button>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {['USD', 'BTC', 'ETH', 'BNB', 'SOL', 'BCH'].map((symbol) => {
          const item = assetDetails[symbol] || INITIAL_ASSET_DATA[symbol];
          const userBalance = balances[symbol] || 0;
          const estimatedUSD = userBalance * item.priceUSD;
          const isPositive = item.change24h >= 0;
          const isUpdatedUp = item.lastUpdateState === 'up';
          const isUpdatedDown = item.lastUpdateState === 'down';

          return (
            <div
              key={symbol}
              className={`p-3.5 rounded-xl bg-background border transition-all duration-300 relative overflow-hidden group ${
                isUpdatedUp
                  ? 'border-success/60 bg-success/10 shadow-sm scale-[1.01]'
                  : isUpdatedDown
                  ? 'border-danger/60 bg-danger/10 shadow-sm scale-[1.01]'
                  : 'border-glass-border hover:border-gold/40'
              }`}
            >
              {/* Asset Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br border flex items-center justify-center font-bold text-sm font-mono ${item.iconBg}`}
                  >
                    {item.iconText}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-ink flex items-center gap-1">
                      <span>{symbol}</span>
                      <span className="text-[10px] text-ink-muted font-normal">({item.name})</span>
                    </div>
                    <div className="text-[10px] text-ink-muted font-mono">
                      Rate: ${item.priceUSD > 1 ? item.priceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.priceUSD}
                    </div>
                  </div>
                </div>

                {symbol !== 'USD' && (
                  <div
                    className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isPositive
                        ? 'bg-success/15 text-success border-success/30'
                        : 'bg-danger/15 text-danger border-danger/30'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{isPositive ? `+${item.change24h}%` : `${item.change24h}%`}</span>
                  </div>
                )}
              </div>

              {/* Balance & Estimated Value */}
              <div className="mt-3 pt-2 border-t border-glass-border flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] text-ink-muted uppercase font-semibold">Holdings</div>
                  <div className="font-mono font-bold text-sm text-gold mt-0.5">
                    <AnimatedCounter value={userBalance} decimals={symbol === 'USD' ? 2 : 4} suffix={` ${symbol}`} />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-ink-muted uppercase font-semibold">Est. USD Value</div>
                  <div className="font-mono font-bold text-xs text-ink mt-0.5">
                    <AnimatedCounter value={estimatedUSD} prefix="$" decimals={2} />
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar on Hover */}
              <div className="mt-2 pt-2 border-t border-glass-border/50 flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onOpenModal('deposit')}
                  className="px-2 py-1 rounded bg-surface hover:bg-gold/20 text-gold text-[10px] font-bold border border-glass-border transition-all flex items-center gap-1"
                  title={`Deposit ${symbol}`}
                >
                  <Plus className="h-3 w-3" /> Deposit
                </button>
                {symbol !== 'USD' && (
                  <button
                    onClick={() => onOpenModal('convert')}
                    className="px-2 py-1 rounded bg-surface hover:bg-violet/20 text-violet text-[10px] font-bold border border-glass-border transition-all flex items-center gap-1"
                    title={`Swap ${symbol}`}
                  >
                    <ArrowRightLeft className="h-3 w-3" /> Swap
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SpotlightCard>
  );
};
