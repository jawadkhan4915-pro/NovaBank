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

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Banking Dashboard
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="System Live" />
          </h1>
          <p className="text-xs text-slate-400">Crypto-fiat ledger reconciled in real time</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenModal('deposit')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30 text-xs font-bold hover:bg-aurora-cyan/30 transition-all"
          >
            <ArrowDownRight className="h-4 w-4" /> Deposit Crypto
          </button>
          <button
            onClick={() => onOpenModal('convert')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-aurora-violet/20 text-aurora-violet border border-aurora-violet/30 text-xs font-bold hover:bg-aurora-violet/30 transition-all"
          >
            <ArrowRightLeft className="h-4 w-4" /> Convert to USD
          </button>
          <button
            onClick={() => onOpenModal('loan')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 transition-all"
          >
            <Landmark className="h-4 w-4" /> Take Loan
          </button>
          <button
            onClick={refreshData}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-all"
            title="Refresh Balances"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Bento Box 1: Hero Total Portfolio Card (Span 2) */}
        <div className="md:col-span-2 glass-card rounded-3xl p-6 border border-white/15 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-aurora-violet/20 blur-3xl pointer-events-none group-hover:scale-125 transition-all duration-500" />
          
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-aurora-cyan" /> Total Portfolio Net Worth
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
              +4.8% (24h)
            </span>
          </div>

          <div className="text-4xl lg:text-5xl font-black text-white tracking-tight tabular-nums my-3">
            ${totalPortfolioUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            <span className="text-xs text-slate-400 font-normal ml-2">USD</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">USD Fiat Balance</div>
              <div className="font-bold text-white text-sm tabular-nums">${balances.USD || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Bitcoin (BTC)</div>
              <div className="font-bold text-aurora-cyan text-sm tabular-nums">{balances.BTC || 0} BTC</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Ethereum (ETH)</div>
              <div className="font-bold text-aurora-violet text-sm tabular-nums">{balances.ETH || 0} ETH</div>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Virtual Card 3D Preview (Span 1) */}
        <div className="glass-card rounded-3xl p-5 border border-white/15 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>NovaBank Card</span>
            <span className="text-[10px] text-aurora-cyan uppercase font-mono">{activeCard?.cardType || 'No Card'}</span>
          </div>

          {activeCard ? (
            <div className="my-4 p-4 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-white/20 shadow-xl space-y-3 transform group-hover:-rotate-1 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="font-black tracking-widest text-xs text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-violet">
                  NOVABANK
                </span>
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
              <div className="font-mono text-sm tracking-wider text-white font-bold">{activeCard.maskedPan}</div>
              <div className="flex justify-between items-end text-[10px] text-slate-300 font-medium">
                <div>{activeCard.cardholderName}</div>
                <div>{activeCard.expiryMonth}/{activeCard.expiryYear}</div>
              </div>
            </div>
          ) : (
            <div className="my-4 p-6 rounded-2xl border border-dashed border-white/20 text-center">
              <CreditCard className="h-8 w-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No active payment card</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            {activeCard ? (
              <button
                onClick={() => onOpenModal('test_card')}
                className="w-full py-2 rounded-xl bg-aurora-emerald/20 text-aurora-emerald border border-aurora-emerald/30 font-bold text-xs hover:bg-aurora-emerald/30 transition-all text-center"
              >
                Test POS Charge
              </button>
            ) : (
              <button
                onClick={() => onOpenModal('issue_card')}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-violet font-bold text-xs text-white hover:opacity-90 transition-all text-center"
              >
                Issue Instant Card
              </button>
            )}
          </div>
        </div>

        {/* Bento Box 3: Loan LTV Health Ratio Gauge (Span 1) */}
        <div className="glass-card rounded-3xl p-5 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Loan Health</span>
            <Landmark className="h-4 w-4 text-aurora-violet" />
          </div>

          {activeLoan ? (
            <div className="my-3 space-y-2">
              <div className="text-center">
                <div className="text-3xl font-black text-white tabular-nums">${activeLoan.disbursedAmountUSD} USD</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Collateral: {activeLoan.collateralAmount} {activeLoan.collateralAsset}</div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Current LTV Ratio</span>
                  <span className="text-aurora-cyan font-bold">{(activeLoan.currentLtvRatio * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-aurora-cyan"
                    style={{ width: `${Math.min(100, activeLoan.currentLtvRatio * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="my-4 text-center">
              <div className="text-2xl font-black text-slate-500">0 Active Loans</div>
              <p className="text-[11px] text-slate-400 mt-1">Unlock liquidity up to 50% LTV</p>
            </div>
          )}

          <button
            onClick={() => onOpenModal('loan')}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/10 text-center"
          >
            {activeLoan ? 'Repay Loan ($1 Fee)' : 'Borrow USD Now'}
          </button>
        </div>

        {/* Bento Box 4: Crypto Balances List (Span 2) */}
        <div className="md:col-span-2 glass-card rounded-3xl p-5 border border-white/15">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-4">
            <span>Supported Assets & Live Rates</span>
            <span className="text-[10px] text-aurora-cyan font-mono">Live Feeds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { symbol: 'BTC', name: 'Bitcoin', rate: rates.BTC, color: 'text-amber-400' },
              { symbol: 'ETH', name: 'Ethereum', rate: rates.ETH, color: 'text-indigo-400' },
              { symbol: 'BNB', name: 'BNB Chain', rate: rates.BNB, color: 'text-yellow-400' },
              { symbol: 'SOL', name: 'Solana', rate: rates.SOL, color: 'text-emerald-400' },
              { symbol: 'BCH', name: 'Bitcoin Cash', rate: rates.BCH, color: 'text-teal-400' },
            ].map((coin) => (
              <div key={coin.symbol} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-black text-xs ${coin.color}`}>{coin.symbol}</span>
                    <span className="text-[10px] text-slate-400">{coin.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">${coin.rate.toLocaleString()} USD</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-white tabular-nums">{balances[coin.symbol] || 0}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ≈ ${((balances[coin.symbol] || 0) * coin.rate).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Box 5: Recent Double-Entry Ledger History (Span 2) */}
        <div className="md:col-span-2 glass-card rounded-3xl p-5 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-3">
            <span>Ledger Audit Trail</span>
            <span className="text-[10px] text-slate-500">Immutable Double-Entry</span>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No transactions recorded yet</div>
            ) : (
              history.map((item) => (
                <div key={item.id || (item as any)._id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200 uppercase text-[11px]">{item.refType}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Ref: {item.refId}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold tabular-nums ${item.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {item.type === 'credit' ? '+' : '-'}{item.amount} {item.currency}
                    </div>
                    <div className="text-[9px] text-slate-500">{new Date(item.createdAt).toLocaleTimeString()}</div>
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
