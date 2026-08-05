import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  CreditCard,
  Landmark,
  ShieldCheck,
  RefreshCw,
  Gift,
  Send,
} from 'lucide-react';
import { api } from '../../lib/api';
import { CardDetails, LoanDetails, LedgerEntry, CryptoCurrency } from '@novabank/shared';
import { SpotlightCard } from '../../components/SpotlightCard';
import { TiltCard } from '../../components/TiltCard';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { LiveAssetBalancesCard } from '../../components/LiveAssetBalancesCard';
import { useAuthStore } from '../../store/useAuthStore';

interface BentoDashboardProps {
  onOpenModal: (modalName: string) => void;
  balances: Record<string, number>;
  depositAddresses: Record<string, string>;
  cards: CardDetails[];
  loans: LoanDetails[];
  history: LedgerEntry[];
  refreshData: () => void;
  onOpenReferral?: () => void;
  onOpenKyc?: () => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  onOpenModal,
  balances,
  cards,
  loans,
  history,
  refreshData,
  onOpenReferral,
  onOpenKyc,
}) => {
  const { user } = useAuthStore();
  const [liveRates, setLiveRates] = useState<Record<string, number>>({
    BTC: 65420,
    ETH: 3512,
    BNB: 584,
    SOL: 148,
    BCH: 452,
    USD: 1,
  });

  // Calculate total portfolio estimated USD value using live rates
  const cryptoUSD =
    (balances.BTC || 0) * (liveRates.BTC || 65420) +
    (balances.ETH || 0) * (liveRates.ETH || 3512) +
    (balances.BNB || 0) * (liveRates.BNB || 584) +
    (balances.SOL || 0) * (liveRates.SOL || 148) +
    (balances.BCH || 0) * (liveRates.BCH || 452);
  const totalPortfolioUSD = Math.round(((balances.USD || 0) + cryptoUSD) * 100) / 100;

  const activeLoan = loans[0];
  const activeCard = cards[0];

  // Helper for Loan LTV Risk Threshold Label
  const getLtvStatus = (ltv: number) => {
    if (ltv <= 0.5) return { label: 'Healthy (<50%)', class: 'text-success bg-success/20 border-success/30', bar: 'bg-success' };
    if (ltv <= 0.75) return { label: 'Watch (50-75%)', class: 'text-gold bg-gold/20 border-gold/30', bar: 'bg-gold' };
    return { label: 'At Risk (>75%)', class: 'text-danger bg-danger/20 border-danger/30', bar: 'bg-danger' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Banking Dashboard
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" title="System Live" />
            {user?.bankIdNumber && (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                Bank ID: {user.bankIdNumber}
              </span>
            )}
          </h1>
          <p className="text-xs text-ink-muted">Crypto-fiat ledger reconciled in real time</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenReferral && (
            <button
              onClick={onOpenReferral}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-gold/20 via-violet/20 to-gold/20 hover:from-gold/30 hover:to-violet/30 border border-gold/40 text-xs font-bold text-gold transition-all shadow-sm"
            >
              <Gift className="h-4 w-4 text-gold animate-bounce" />
              <span>Invite Friends ($2 Gift)</span>
            </button>
          )}

          <button
            onClick={() => onOpenModal('deposit')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
          >
            <ArrowDownRight className="h-4 w-4" /> Deposit
          </button>
          <button
            onClick={() => onOpenModal('withdraw')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-hover text-ink border border-glass-border text-xs font-bold transition-all"
          >
            <ArrowUpRight className="h-4 w-4 text-gold" /> Withdraw
          </button>
          <button
            onClick={() => onOpenModal('transfer')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet/20 text-violet border border-violet/30 text-xs font-bold hover:bg-violet/30 transition-all"
          >
            <Send className="h-4 w-4 text-violet" /> Transfer
          </button>
          <button
            onClick={() => onOpenModal('convert')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-hover text-ink border border-glass-border text-xs font-bold transition-all"
          >
            <ArrowRightLeft className="h-4 w-4" /> Convert
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

      {/* Bento Grid Layout with Staggered Framer Motion */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {/* Bento Box 1: Hero Total Portfolio Card (Span 2) */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <SpotlightCard variant="hero" spotlightColor="rgba(201, 162, 92, 0.2)" className="p-6">
            <div className="flex items-center justify-between text-xs text-ink-muted font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-ink">
                <Wallet className="h-4 w-4 text-gold animate-pulse" /> Total Portfolio Net Worth
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-success/20 text-success font-bold border border-success/30 text-xs font-mono">
                +4.8% (24h)
              </span>
            </div>

            <div className="text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight font-mono my-3">
              <AnimatedCounter value={totalPortfolioUSD} prefix="$" />
              <span className="text-xs text-ink-muted font-sans font-normal ml-2">USD</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-glass-border text-xs">
              <div className="p-2.5 rounded-xl bg-background border border-glass-border">
                <div className="text-xs text-ink-muted uppercase font-semibold">USD Fiat Balance</div>
                <div className="font-mono font-bold text-ink text-sm mt-0.5">
                  <AnimatedCounter value={balances.USD || 0} prefix="$" />
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-background border border-glass-border">
                <div className="text-xs text-ink-muted uppercase font-semibold">Bitcoin (BTC)</div>
                <div className="font-mono font-bold text-gold text-sm mt-0.5">
                  <AnimatedCounter value={balances.BTC || 0} suffix=" BTC" decimals={4} />
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-background border border-glass-border">
                <div className="text-xs text-ink-muted uppercase font-semibold">Ethereum (ETH)</div>
                <div className="font-mono font-bold text-violet text-sm mt-0.5">
                  <AnimatedCounter value={balances.ETH || 0} suffix=" ETH" decimals={4} />
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Bento Box 2: Virtual Card 3D Preview (Span 1) */}
        <motion.div variants={itemVariants}>
          <SpotlightCard className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between text-xs font-bold text-ink mb-2">
              <span>NovaBank Card</span>
              <span className="text-xs text-gold font-mono uppercase">{activeCard?.cardType || 'No Card'}</span>
            </div>

            {activeCard ? (
              <div className="my-2">
                <TiltCard
                  cardType={activeCard.cardType}
                  maskedPan={activeCard.maskedPan}
                  cardholderName={activeCard.cardholderName}
                  expiryMonth={activeCard.expiryMonth}
                  expiryYear={activeCard.expiryYear}
                  status={activeCard.status}
                />
              </div>
            ) : (
              <div className="my-4 p-6 rounded-2xl border border-dashed border-glass-border text-center">
                <CreditCard className="h-8 w-8 text-ink-faint mx-auto mb-2" />
                <p className="text-xs text-ink-muted">No active payment card</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 mt-2">
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
          </SpotlightCard>
        </motion.div>

        {/* Bento Box 3: Loan LTV Health Ratio Gauge (Span 1) */}
        <motion.div variants={itemVariants}>
          <SpotlightCard className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between text-xs font-bold text-ink">
              <span>Loan Health</span>
              <Landmark className="h-4 w-4 text-violet" />
            </div>

            {activeLoan ? (
              <div className="my-3 space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-ink">
                    <AnimatedCounter value={activeLoan.disbursedAmountUSD} prefix="$" /> USD
                  </div>
                  <div className="text-xs text-ink-muted font-mono mt-0.5">Collateral: {activeLoan.collateralAmount} {activeLoan.collateralAsset}</div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-ink-muted">
                    <span>Current LTV</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${getLtvStatus(activeLoan.currentLtvRatio).class}`}>
                      {getLtvStatus(activeLoan.currentLtvRatio).label}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-background border border-glass-border overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, activeLoan.currentLtvRatio * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${getLtvStatus(activeLoan.currentLtvRatio).bar}`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-4 p-6 rounded-2xl border border-dashed border-glass-border text-center">
                <Landmark className="h-8 w-8 text-ink-faint mx-auto mb-2" />
                <p className="text-xs text-ink-muted">No active crypto loan</p>
              </div>
            )}

            <button
              onClick={() => onOpenModal('loan')}
              className="w-full py-2 rounded-xl bg-violet/20 text-violet border border-violet/30 font-bold text-xs hover:bg-violet/30 transition-all text-center"
            >
              {activeLoan ? 'Manage Loan / Repay' : 'Apply Instant USD Loan'}
            </button>
          </SpotlightCard>
        </motion.div>

        {/* Bento Box 4: Multi-Asset Wallet Grid with Live Rates & Cards */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4">
          <LiveAssetBalancesCard
            balances={balances}
            onOpenModal={onOpenModal}
            onRatesUpdated={(rates) => setLiveRates(rates)}
          />
        </motion.div>

        {/* Bento Box 5: Live Double-Entry Ledger Feed */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4">
          <SpotlightCard className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-ink">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" /> Live Ledger Transaction Audit
              </span>
              <span className="text-xs text-ink-muted font-mono bg-background border border-glass-border px-2 py-0.5 rounded-full">
                Audit Trail Verified
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="p-4 text-center text-xs text-ink-faint">No recent ledger transactions</div>
              ) : (
                history.map((tx: any) => (
                  <div
                    key={tx.id || tx._id}
                    className="p-2.5 rounded-xl bg-background border border-glass-border flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-ink">{tx.type || tx.refType} — {tx.refId || 'Ledger Entry'}</div>
                      <div className="text-xs text-ink-muted">{new Date(tx.createdAt || tx.timestamp || Date.now()).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-success">
                        +${tx.amount || tx.creditUSD || 0} {tx.currency || 'USD'}
                      </div>
                      <div className="text-xs text-ink-faint">Ref: {((tx.id || tx.refId || '') as string).substring(0, 8)}...</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </div>
  );
};
