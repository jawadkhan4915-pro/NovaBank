import React from 'react';
import { Landmark, ShieldCheck, ArrowUpRight, Plus, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LoanDetails, CryptoCurrency } from '@novabank/shared';

interface LoansViewProps {
  loans: LoanDetails[];
  balances: Record<string, number>;
  onOpenLoanModal: () => void;
  refreshData: () => void;
}

export const LoansView: React.FC<LoansViewProps> = ({ loans, balances, onOpenLoanModal, refreshData }) => {
  const mockRates: Record<CryptoCurrency, number> = { BTC: 65000, ETH: 3500, BNB: 580, SOL: 145, BCH: 450 };

  const getLtvStatus = (ltv: number) => {
    if (ltv <= 0.5) return { label: 'Healthy (<50%)', class: 'text-success bg-success/20 border-success/30', bar: 'bg-success' };
    if (ltv <= 0.75) return { label: 'Watch (50-75%)', class: 'text-gold bg-gold/20 border-gold/30', bar: 'bg-gold' };
    return { label: 'At Risk (>75%)', class: 'text-danger bg-danger/20 border-danger/30', bar: 'bg-danger' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Crypto-Backed USD Loans
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet/20 text-violet border border-violet/30 font-semibold font-mono">
              Max 50% LTV
            </span>
          </h1>
          <p className="text-xs text-ink-muted">Unlock USD fiat liquidity without selling your digital assets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLoanModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
          >
            <Plus className="h-4 w-4" /> Apply For Instant Loan
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Loans */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span>Active Borrowings ({loans.length})</span>
            <span className="text-xs text-ink-muted font-mono">Fixed $1 Repayment Fee</span>
          </div>

          {loans.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center border border-glass-border space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-surface border border-glass-border flex items-center justify-center mx-auto text-ink-muted">
                <Landmark className="h-7 w-7 text-violet" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink font-display">No Active Loans</h3>
                <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                  Borrow USD instantly by locking your BTC, ETH, SOL, BNB, or BCH collateral. Zero credit checks.
                </p>
              </div>
              <button
                onClick={onOpenLoanModal}
                className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Borrow USD Now
              </button>
            </div>
          ) : (
            loans.map((loan) => {
              const status = getLtvStatus(loan.currentLtvRatio);

              return (
                <div key={loan.id} className="glass-card rounded-2xl p-6 border border-glass-border space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-ink-muted font-semibold uppercase">Loan Balance</div>
                      <div className="text-2xl font-mono font-bold text-ink">${loan.disbursedAmountUSD} USD</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${status.class}`}>
                      {loan.status}
                    </span>
                  </div>

                  {/* Collateral Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-surface border border-glass-border text-xs">
                    <div>
                      <div className="text-xs text-ink-muted uppercase font-semibold">Collateral Locked</div>
                      <div className="font-mono font-bold text-violet mt-0.5">
                        {loan.collateralAmount} {loan.collateralAsset}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-ink-muted uppercase font-semibold">Origination Value</div>
                      <div className="font-mono font-bold text-ink mt-0.5">${loan.collateralValueAtOriginationUSD} USD</div>
                    </div>
                    <div>
                      <div className="text-xs text-ink-muted uppercase font-semibold">Current Value</div>
                      <div className="font-mono font-bold text-ink mt-0.5">${loan.currentCollateralValueUSD} USD</div>
                    </div>
                  </div>

                  {/* LTV Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-ink-muted flex items-center gap-1">
                        Loan-To-Value (LTV) Health Ratio
                        {loan.currentLtvRatio > 0.75 && <AlertTriangle className="h-3.5 w-3.5 text-danger" />}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${status.class}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-surface border border-glass-border overflow-hidden">
                      <div
                        className={`h-full ${status.bar}`}
                        style={{ width: `${Math.min(100, loan.currentLtvRatio * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenLoanModal}
                      className="w-full py-2.5 rounded-xl bg-violet/20 hover:bg-violet/30 text-violet border border-violet/30 font-bold text-xs transition-all text-center"
                    >
                      Repay Loan ($1 Flat Fee Rule)
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Loan Calculator Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-glass-border space-y-4">
            <h3 className="text-sm font-bold text-ink font-display flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-violet" /> Borrowing Rules
            </h3>
            <ul className="space-y-3 text-xs text-ink-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>Maximum 50% initial LTV ratio ensures position safety.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>Fixed $1 flat fee on loan repayment regardless of amount.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>Instant USD balance deposit upon approval.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
