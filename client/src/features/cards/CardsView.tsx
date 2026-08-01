import React from 'react';
import { CreditCard, Plus, Zap, ShieldCheck, Lock, Activity, ArrowRight } from 'lucide-react';
import { CardDetails } from '@novabank/shared';

interface CardsViewProps {
  cards: CardDetails[];
  onOpenIssueModal: () => void;
  onOpenTestModal: () => void;
}

export const CardsView: React.FC<CardsViewProps> = ({ cards, onOpenIssueModal, onOpenTestModal }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Virtual & Physical Cards
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30 font-semibold">
              Visa / Mastercard
            </span>
          </h1>
          <p className="text-xs text-slate-400">Issue instant payment cards tied directly to your NovaBank ledger</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenIssueModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white text-xs font-bold hover:opacity-90 transition-all shadow-md"
          >
            <Plus className="h-4 w-4" /> Issue New Card
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issued Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Your Active Cards ({cards.length})</span>
            <span className="text-[10px] text-slate-400">Instant Authorization</span>
          </div>

          {cards.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center border border-white/15 space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No Payment Cards Issued</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Issue a virtual card in seconds to spend your crypto and USD balances anywhere worldwide.
                </p>
              </div>
              <button
                onClick={onOpenIssueModal}
                className="px-5 py-2.5 rounded-xl bg-aurora-violet text-white text-xs font-bold hover:bg-aurora-violet/90 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Issue Virtual Card Now
              </button>
            </div>
          ) : (
            cards.map((card) => {
              const spendPercentage = Math.min(100, Math.round((card.spentTodayUSD / card.spendLimitDailyUSD) * 100));

              return (
                <div key={card.id} className="glass-card rounded-3xl p-6 border border-white/15 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-white/20 flex items-center justify-center text-aurora-cyan">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{card.cardholderName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {card.cardType} • Exp: {card.expiryMonth}/{card.expiryYear}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        card.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>

                  {/* Visual Card Display */}
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-white/20 shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-violet">
                        NOVABANK
                      </span>
                      <Zap className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="font-mono text-base tracking-widest text-white font-bold">{card.maskedPan}</div>
                    <div className="flex justify-between items-end text-[10px] text-slate-300">
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase">Cardholder</div>
                        <div className="font-bold">{card.cardholderName}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase">Status</div>
                        <div className="font-bold text-emerald-400">READY</div>
                      </div>
                    </div>
                  </div>

                  {/* Spending Progress */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Daily Limit Spent</span>
                      <span className="text-white font-mono">
                        ${card.spentTodayUSD} / ${card.spendLimitDailyUSD} USD ({spendPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-violet"
                        style={{ width: `${spendPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={onOpenTestModal}
                      className="flex-1 py-2 rounded-xl bg-aurora-emerald/20 text-aurora-emerald border border-aurora-emerald/30 font-bold text-xs hover:bg-aurora-emerald/30 transition-all text-center"
                    >
                      Test POS Charge
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Card Features & Fee Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-aurora-cyan" /> Card Security Rules
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan mt-1.5" />
                <span>Zero cross-border FX markup on international POS purchases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan mt-1.5" />
                <span>Tiered interchange fees: $0.10 (&le;$500), $0.50 ($500-$1000), $1.00 (&gt;$1000).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan mt-1.5" />
                <span>Instant balance deduction from USD fiat or auto-conversion from crypto.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
