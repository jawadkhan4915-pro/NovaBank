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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Crypto-Backed USD Loans
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-aurora-violet/20 text-aurora-violet border border-aurora-violet/30 font-semibold">
              Max 50% LTV
            </span>
          </h1>
          <p className="text-xs text-slate-400">Unlock USD fiat liquidity without selling your digital assets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLoanModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-emerald text-white text-xs font-bold hover:opacity-90 transition-all shadow-md"
          >
            <Plus className="h-4 w-4" /> Apply For Instant Loan
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Loans */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Active Borrowings ({loans.length})</span>
            <span className="text-[10px] text-slate-400">Fixed $1 Repayment Fee</span>
          </div>

          {loans.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center border border-white/15 space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <Landmark className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No Active Loans</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Borrow USD instantly by locking your BTC, ETH, SOL, BNB, or BCH collateral. Zero credit checks.
                </p>
              </div>
              <button
                onClick={onOpenLoanModal}
                className="px-5 py-2.5 rounded-xl bg-aurora-violet text-white text-xs font-bold hover:bg-aurora-violet/90 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Borrow USD Now
              </button>
            </div>
          ) : (
            loans.map((loan) => {
              const ltvPercent = (loan.currentLtvRatio * 100).toFixed(1);
              const isWarning = loan.currentLtvRatio > 0.75;

              return (
                <div key={loan.id} className="glass-card rounded-3xl p-6 border border-white/15 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase">Loan Balance</div>
                      <div className="text-2xl font-black text-white tabular-nums">${loan.disbursedAmountUSD} USD</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isWarning
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  {/* Collateral Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Collateral Locked</div>
                      <div className="font-bold text-aurora-cyan mt-0.5">
                        {loan.collateralAmount} {loan.collateralAsset}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Origination Value</div>
                      <div className="font-bold text-white mt-0.5">${loan.collateralValueAtOriginationUSD} USD</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Value</div>
                      <div className="font-bold text-white mt-0.5">${loan.currentCollateralValueUSD} USD</div>
                    </div>
                  </div>

                  {/* LTV Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400 flex items-center gap-1">
                        Loan-To-Value (LTV) Health Ratio
                        {isWarning && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                      </span>
                      <span className={`font-mono font-bold ${isWarning ? 'text-red-400' : 'text-emerald-400'}`}>
                        {ltvPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full ${isWarning ? 'bg-red-500' : 'bg-aurora-cyan'}`}
                        style={{ width: `${Math.min(100, loan.currentLtvRatio * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenLoanModal}
                      className="w-full py-2.5 rounded-xl bg-aurora-violet/20 hover:bg-aurora-violet/30 text-aurora-violet border border-aurora-violet/30 font-bold text-xs transition-all text-center"
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
          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-aurora-violet" /> Borrowing Rules
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Maximum 50% initial LTV ratio ensures position safety.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Fixed $1 flat fee on loan repayment regardless of amount.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Instant USD balance deposit upon approval.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
