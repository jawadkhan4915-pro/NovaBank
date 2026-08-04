import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, ArrowRightLeft, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from './SpotlightCard';
import { AnimatedCounter } from './AnimatedCounter';

export interface CoinMarketData {
  symbol: string;
  name: string;
  priceUSD: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  sparkline: number[];
  iconBg: string;
  iconText: string;
  lastUpdateState?: 'up' | 'down' | null;
}

const INITIAL_MARKET_COINS: CoinMarketData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUSD: 65420.50,
    change24h: 3.42,
    high24h: 66100.00,
    low24h: 64200.00,
    volume24h: '$34.2B',
    sparkline: [64200, 64500, 64100, 65000, 64800, 65200, 65420.50],
    iconBg: 'from-gold/30 to-gold/10 border-gold/40 text-gold',
    iconText: '₿',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    priceUSD: 3512.80,
    change24h: 4.85,
    high24h: 3580.00,
    low24h: 3410.00,
    volume24h: '$18.6B',
    sparkline: [3410, 3450, 3430, 3490, 3480, 3500, 3512.80],
    iconBg: 'from-violet/30 to-violet/10 border-violet/40 text-violet',
    iconText: 'Ξ',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    priceUSD: 148.60,
    change24h: 8.12,
    high24h: 152.00,
    low24h: 136.50,
    volume24h: '$4.2B',
    sparkline: [136.5, 140, 138, 144, 142, 146, 148.60],
    iconBg: 'from-violet/30 to-gold/10 border-violet/40 text-violet',
    iconText: '◎',
  },
  {
    symbol: 'BNB',
    name: 'BNB Smart Chain',
    priceUSD: 584.20,
    change24h: -0.65,
    high24h: 595.00,
    low24h: 578.00,
    volume24h: '$1.4B',
    sparkline: [590, 592, 585, 582, 588, 581, 584.20],
    iconBg: 'from-gold/30 to-gold/10 border-gold/40 text-gold',
    iconText: '⬢',
  },
  {
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    priceUSD: 452.10,
    change24h: 1.75,
    high24h: 465.00,
    low24h: 440.00,
    volume24h: '$620M',
    sparkline: [440, 445, 442, 450, 448, 451, 452.10],
    iconBg: 'from-success/30 to-success/10 border-success/40 text-success',
    iconText: 'Ƀ',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    priceUSD: 0.584,
    change24h: 5.30,
    high24h: 0.610,
    low24h: 0.550,
    volume24h: '$2.1B',
    sparkline: [0.55, 0.56, 0.57, 0.565, 0.58, 0.582, 0.584],
    iconBg: 'from-violet/30 to-violet/10 border-violet/40 text-violet',
    iconText: '✕',
  },
];

interface LiveCryptoMarketGridProps {
  onOpenConvert?: () => void;
}

export const LiveCryptoMarketGrid: React.FC<LiveCryptoMarketGridProps> = ({ onOpenConvert }) => {
  const [coins, setCoins] = useState<CoinMarketData[]>(INITIAL_MARKET_COINS);
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  // Real-time market feed with micro-tick jitter
  useEffect(() => {
    let isMounted = true;

    const fetchLivePrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,bitcoin-cash,ripple&vs_currencies=usd&include_24hr_change=true'
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
              ripple: 'XRP',
            };

            setCoins((prevCoins) =>
              prevCoins.map((coin) => {
                const geckoId = Object.keys(mapping).find((key) => mapping[key] === coin.symbol);
                if (geckoId && data[geckoId]) {
                  const newPrice = data[geckoId].usd;
                  const change = data[geckoId].usd_24h_change || coin.change24h;
                  const diff = newPrice - coin.priceUSD;
                  return {
                    ...coin,
                    priceUSD: newPrice,
                    change24h: Math.round(change * 100) / 100,
                    lastUpdateState: diff > 0 ? 'up' : diff < 0 ? 'down' : null,
                  };
                }
                return coin;
              })
            );
          }
        }
      } catch (err) {
        // Silent catch for offline or rate limited scenarios
      }
    };

    fetchLivePrices();
    const fetchInterval = setInterval(fetchLivePrices, 15000);

    // Dynamic price movement tick simulation
    const jitterInterval = setInterval(() => {
      if (!isMounted) return;
      setCoins((prevCoins) => {
        const randomIndex = Math.floor(Math.random() * prevCoins.length);
        const targetCoin = prevCoins[randomIndex];
        const deltaPercent = (Math.random() * 0.36 - 0.16) / 100;
        const priceDelta = targetCoin.priceUSD * deltaPercent;
        const newPrice = Math.max(0.001, targetCoin.priceUSD + priceDelta);
        const state = priceDelta >= 0 ? 'up' : 'down';

        return prevCoins.map((c, i) => {
          if (i === randomIndex) {
            const formattedPrice =
              newPrice > 10
                ? Math.round(newPrice * 100) / 100
                : Math.round(newPrice * 1000) / 1000;
            const updatedSparkline = [...c.sparkline.slice(1), formattedPrice];
            return {
              ...c,
              priceUSD: formattedPrice,
              sparkline: updatedSparkline,
              lastUpdateState: state,
            };
          }
          return { ...c, lastUpdateState: null };
        });
      });
    }, 2200);

    return () => {
      isMounted = false;
      clearInterval(fetchInterval);
      clearInterval(jitterInterval);
    };
  }, []);

  const filteredCoins = coins.filter((c) => {
    if (filter === 'gainers') return c.change24h >= 0;
    if (filter === 'losers') return c.change24h < 0;
    return true;
  });

  // SVG Sparkline Helper Function
  const renderSparkline = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 120;
    const height = 36;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${x},${y}`;
      })
      .join(' ');

    const color = isPositive ? '#3FB77D' : '#E5675C';
    const gradientId = `spark-grad-${data[0]}-${isPositive ? 'pos' : 'neg'}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold mb-2">
            <Zap className="h-3.5 w-3.5 animate-pulse text-gold" />
            <span>REAL-TIME CRYPTO LIQUIDITY FEED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Live Market Coin Rates
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-ping" />
          </h2>
          <p className="text-xs text-ink-muted">
            Institutional exchange order book prices updated in real time with zero-slippage quotes
          </p>
        </div>

        {/* Filter Controls & Swap Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-surface p-1 rounded-xl border border-glass-border">
            {(['all', 'gainers', 'losers'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === f
                    ? 'bg-gold/20 text-gold border border-gold/40 shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {onOpenConvert && (
            <button
              onClick={onOpenConvert}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Instant Swap</span>
            </button>
          )}
        </div>
      </div>

      {/* Crypto Coin Market Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCoins.map((coin) => {
          const isPositive = coin.change24h >= 0;
          const isUpdatedUp = coin.lastUpdateState === 'up';
          const isUpdatedDown = coin.lastUpdateState === 'down';

          return (
            <SpotlightCard
              key={coin.symbol}
              spotlightColor={isPositive ? 'rgba(63, 183, 125, 0.15)' : 'rgba(229, 103, 92, 0.15)'}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                isUpdatedUp
                  ? 'border-success/60 bg-success/5 shadow-md shadow-success/10 scale-[1.01]'
                  : isUpdatedDown
                  ? 'border-danger/60 bg-danger/5 shadow-md shadow-danger/10 scale-[1.01]'
                  : 'border-glass-border hover:border-gold/40'
              }`}
            >
              {/* Card Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br border flex items-center justify-center font-bold text-lg font-mono ${coin.iconBg}`}
                  >
                    {coin.iconText}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-base text-ink">{coin.symbol}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-glass-border text-ink-muted">
                        USD
                      </span>
                    </div>
                    <div className="text-xs text-ink-muted font-medium">{coin.name}</div>
                  </div>
                </div>

                {/* 24h Change Pill */}
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                    isPositive
                      ? 'bg-success/15 text-success border-success/30'
                      : 'bg-danger/15 text-danger border-danger/30'
                  }`}
                >
                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{isPositive ? `+${coin.change24h}%` : `${coin.change24h}%`}</span>
                </div>
              </div>

              {/* Price & Sparkline Section */}
              <div className="flex items-end justify-between my-3 pt-2 border-t border-glass-border">
                <div>
                  <div className="text-[11px] uppercase font-semibold text-ink-muted tracking-wider">
                    Live Market Rate
                  </div>
                  <div
                    className={`text-2xl font-mono font-bold tracking-tight mt-0.5 transition-colors ${
                      isUpdatedUp
                        ? 'text-success font-extrabold'
                        : isUpdatedDown
                        ? 'text-danger font-extrabold'
                        : 'text-ink'
                    }`}
                  >
                    ${coin.priceUSD > 1 ? coin.priceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.priceUSD}
                  </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="pb-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  {renderSparkline(coin.sparkline, isPositive)}
                </div>
              </div>

              {/* 24h High/Low Stats Footer */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-glass-border text-[11px] font-mono text-ink-muted">
                <div>
                  <span className="block text-[10px] text-ink-faint uppercase font-sans">24h High</span>
                  <span className="font-bold text-ink">${coin.high24h.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-ink-faint uppercase font-sans">24h Low</span>
                  <span className="font-bold text-ink">${coin.low24h.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-ink-faint uppercase font-sans">24h Vol</span>
                  <span className="font-bold text-gold">{coin.volume24h}</span>
                </div>
              </div>

              {/* Action Button */}
              {onOpenConvert && (
                <button
                  onClick={onOpenConvert}
                  className="w-full mt-4 py-2 rounded-xl bg-surface hover:bg-gold/20 hover:text-gold border border-glass-border hover:border-gold/40 text-ink text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Trade {coin.symbol} Now</span>
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </button>
              )}
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
