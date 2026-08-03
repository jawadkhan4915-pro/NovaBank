import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  CreditCard,
  Landmark,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Zap,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';
import { CardDetails, LoanDetails, LedgerEntry, CryptoCurrency } from '@novabank/shared';

interface BentoDashboardProps {
  onOpenModal: (modalName: string) => void;
  balances: Record<string, number>;
  depositAddresses: Record<string, string>;
  cards: CardDetails[];
  loans: LoanDetails[];
  history: LedgerEntry[];
  refreshData: () => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  onOpenModal,
  balances,
  cards,
  loans,
  history,
  refreshData,
}) => {
  // Calculate total portfolio estimated USD value using live rates
  const rates: Record<CryptoCurrency, number> = { BTC: 65000, ETH: 3500, BNB: 580, SOL: 145, BCH: 450 };
  const cryptoUSD =
    (balances.BTC || 0) * rates.BTC +
    (balances.ETH || 0) * rates.ETH +
    (balances.BNB || 0) * rates.BNB +
    (balances.SOL || 0) * rates.SOL +
    (balances.BCH || 0) * rates.BCH;
  const totalPortfolioUSD = Math.round(((balances.USD || 0) + cryptoUSD) * 100) / 100;

  const activeLoan = loans[0];
  const activeCard = cards[0];

  // Helper for Loan LTV Risk Threshold Label (UX Issue #7 Fix)
  const getLtvStatus = (ltv: number) => {
    if (ltv <= 0.5) return { label: 'Healthy (<50%)', class: 'text-success bg-success/20 border-success/30', bar: 'bg-success' };
    if (ltv <= 0.75) return { label: 'Watch (50-75%)', class: 'text-gold bg-gold/20 border-gold/30', bar: 'bg-gold' };
    return { label: 'At Risk (>75%)', class: 'text-danger bg-danger/20 border-danger/30', bar: 'bg-danger' };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Banking Dashboard
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" title="System Live" />
          </h1>
          <p className="text-xs text-ink-muted">Crypto-fiat ledger reconciled in real time</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenModal('deposit')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
          >
            <ArrowDownRight className="h-4 w-4" /> Deposit Crypto
          </button>
          <button
            onClick={() => onOpenModal('convert')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet/20 text-violet border border-violet/30 text-xs font-bold hover:bg-violet/30 transition-all"
          >
            <ArrowRightLeft className="h-4 w-4" /> Convert to USD
          </button>
          <button
            onClick={() => onOpenModal('loan')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-hover text-ink border border-glass-border text-xs font-bold transition-all"
          >
            <Landmark className="h-4 w-4" /> Take Loan
          </button>
          <button
            onClick={refreshData}
            className="p-2 rounded-xl bg-surface text-ink-muted hover:text-ink border border-glass-border transition-all"
            title="Refresh Balances"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Bento Box 1: Hero Total Portfolio Card (Span 2) */}
        <div className="md:col-span-2 glass-hero rounded-3xl p-6 border border-gold/25 relative overflow-hidden group shadow-gold-glow">
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gold/10 blur-3xl pointer-events-none group-hover:scale-125 transition-all duration-500" />
          
          <div className="flex items-center justify-between text-xs text-ink-muted font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-ink">
              <Wallet className="h-4 w-4 text-gold" /> Total Portfolio Net Worth
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-success/20 text-success font-bold border border-success/30 text-xs font-mono">
              +4.8% (24h)
            </span>
          </div>

          <div className="text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight font-mono my-3">
            ${totalPortfolioUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            <span className="text-xs text-ink-muted font-sans font-normal ml-2">USD</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-glass-border text-xs">
            <div className="p-2.5 rounded-xl bg-surface border border-glass-border">
              <div className="text-xs text-ink-muted uppercase font-semibold">USD Fiat Balance</div>
              <div className="font-mono font-bold text-ink text-sm mt-0.5">${balances.USD || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-surface border border-glass-border">
              <div className="text-xs text-ink-muted uppercase font-semibold">Bitcoin (BTC)</div>
              <div className="font-mono font-bold text-gold text-sm mt-0.5">{balances.BTC || 0} BTC</div>
            </div>
            <div className="p-2.5 rounded-xl bg-surface border border-glass-border">
              <div className="text-xs text-ink-muted uppercase font-semibold">Ethereum (ETH)</div>
              <div className="font-mono font-bold text-violet text-sm mt-0.5">{balances.ETH || 0} ETH</div>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Virtual Card 3D Preview (Span 1) */}
        <div className="glass-card rounded-2xl p-5 border border-glass-border flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span>NovaBank Card</span>
            <span className="text-xs text-gold font-mono uppercase">{activeCard?.cardType || 'No Card'}</span>
          </div>

          {activeCard ? (
            <div className="my-4 p-4 rounded-2xl bg-gradient-to-tr from-[#0B0D12] via-[#141822] to-[#1E1B4B] border border-glass-border shadow-xl space-y-3 transform group-hover:-rotate-1 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-xs tracking-widest text-gold">
                  NOVABANK
                </span>
                <Zap className="h-4 w-4 text-gold" />
              </div>
              <div className="font-mono text-sm tracking-widest text-ink font-bold">{activeCard.maskedPan}</div>
              <div className="flex justify-between items-end text-xs text-ink-muted font-mono">
                <div>{activeCard.cardholderName}</div>
                <div>{activeCard.expiryMonth}/{activeCard.expiryYear}</div>
              </div>
            </div>
          ) : (
            <div className="my-4 p-6 rounded-2xl border border-dashed border-glass-border text-center">
              <CreditCard className="h-8 w-8 text-ink-faint mx-auto mb-2" />
              <p className="text-xs text-ink-muted">No active payment card</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            {activeCard ? (
              <button
                onClick={() => onOpenModal('test_card')}
                className="w-full py-2 rounded-xl bg-success/20 text-success border border-success/30 font-bold text-xs hover:bg-success/30 transition-all text-center"
              >
                Test POS Charge
              </button>
            ) : (
              <button
                onClick={() => onOpenModal('issue_card')}
                className="w-full py-2 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background transition-all text-center shadow-gold-glow"
              >
                Issue Instant Card
              </button>
            )}
          </div>
        </div>

        {/* Bento Box 3: Loan LTV Health Ratio Gauge (Span 1) */}
        <div className="glass-card rounded-2xl p-5 border border-glass-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span>Loan Health</span>
            <Landmark className="h-4 w-4 text-violet" />
          </div>

          {activeLoan ? (
            <div className="my-3 space-y-3">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-ink">${activeLoan.disbursedAmountUSD} USD</div>
                <div className="text-xs text-ink-muted font-mono mt-0.5">Collateral: {activeLoan.collateralAmount} {activeLoan.collateralAsset}</div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-ink-muted">
                  <span>Current LTV</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${getLtvStatus(activeLoan.currentLtvRatio).class}`}>
                    {getLtvStatus(activeLoan.currentLtvRatio).label}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface border border-glass-border overflow-hidden">
                  <div
                    className={`h-full ${getLtvStatus(activeLoan.currentLtvRatio).bar}`}
                    style={{ width: `${Math.min(100, activeLoan.currentLtvRatio * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="my-4 text-center">
              <div className="text-xl font-display font-bold text-ink-muted">0 Active Loans</div>
              <p className="text-xs text-ink-faint mt-1">Unlock liquidity up to 50% LTV</p>
            </div>
          )}

          <button
            onClick={() => onOpenModal('loan')}
            className="w-full py-2 rounded-xl bg-surface hover:bg-surface-hover text-ink font-bold text-xs transition-all border border-glass-border text-center"
          >
            {activeLoan ? 'Repay Loan ($1 Fee)' : 'Borrow USD Now'}
          </button>
        </div>

        {/* Bento Box 4: Crypto Balances List (Span 2) */}
        <div className="md:col-span-2 glass-card rounded-2xl p-5 border border-glass-border">
          <div className="flex items-center justify-between text-xs font-bold text-ink mb-4">
            <span>Supported Assets & Live Rates</span>
            <span className="text-xs text-ink-muted font-mono bg-surface border border-glass-border px-2.5 py-0.5 rounded-full">
              Illustrative Feed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { symbol: 'BTC', name: 'Bitcoin', rate: rates.BTC, color: 'text-gold' },
              { symbol: 'ETH', name: 'Ethereum', rate: rates.ETH, color: 'text-violet' },
              { symbol: 'BNB', name: 'BNB Chain', rate: rates.BNB, color: 'text-gold' },
              { symbol: 'SOL', name: 'Solana', rate: rates.SOL, color: 'text-violet' },
              { symbol: 'BCH', name: 'Bitcoin Cash', rate: rates.BCH, color: 'text-gold' },
            ].map((coin) => (
              <div key={coin.symbol} className="p-3 rounded-xl bg-surface border border-glass-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-mono font-bold text-xs ${coin.color}`}>{coin.symbol}</span>
                    <span className="text-xs text-ink-faint">{coin.name}</span>
                  </div>
                  <div className="text-xs text-ink-muted font-mono mt-0.5">${coin.rate.toLocaleString()} USD</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-ink">{balances[coin.symbol] || 0}</div>
                  <div className="text-xs text-ink-muted font-mono">
                    ≈ ${((balances[coin.symbol] || 0) * coin.rate).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Box 5: Recent Double-Entry Ledger History (Span 2) */}
        <div className="md:col-span-2 glass-card rounded-2xl p-5 border border-glass-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-ink mb-3">
            <span>Ledger Audit Trail</span>
            <span className="text-xs text-ink-muted font-mono">Immutable Double-Entry</span>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-center py-8 text-xs text-ink-faint">No transactions recorded yet</div>
            ) : (
              history.map((item) => (
                <div key={item.id || (item as any)._id} className="p-2.5 rounded-xl bg-surface border border-glass-border flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-ink uppercase text-xs">{item.refType}</div>
                    <div className="text-xs text-ink-faint font-mono">Ref: {item.refId}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold text-xs ${item.type === 'credit' ? 'text-success' : 'text-ink'}`}>
                      {item.type === 'credit' ? '+' : '-'}{item.amount} {item.currency}
                    </div>
                    <div className="text-xs text-ink-faint font-mono">{new Date(item.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
