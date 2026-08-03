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
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Virtual & Physical Cards
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-semibold font-mono">
              Visa / Mastercard
            </span>
          </h1>
          <p className="text-xs text-ink-muted">Issue instant payment cards tied directly to your NovaBank ledger</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenIssueModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
          >
            <Plus className="h-4 w-4" /> Issue New Card
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issued Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span>Your Active Cards ({cards.length})</span>
            <span className="text-xs text-ink-muted font-mono">Instant Authorization</span>
          </div>

          {cards.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center border border-glass-border space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-surface border border-glass-border flex items-center justify-center mx-auto text-ink-muted">
                <CreditCard className="h-7 w-7 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink font-display">No Payment Cards Issued</h3>
                <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                  Issue a virtual card in seconds to spend your crypto and USD balances anywhere worldwide.
                </p>
              </div>
              <button
                onClick={onOpenIssueModal}
                className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Issue Virtual Card Now
              </button>
            </div>
          ) : (
            cards.map((card) => {
              const spendPercentage = Math.min(100, Math.round((card.spentTodayUSD / card.spendLimitDailyUSD) * 100));

              return (
                <div key={card.id} className="glass-card rounded-2xl p-6 border border-glass-border space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-surface border border-glass-border flex items-center justify-center text-gold">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink">{card.cardholderName}</div>
                        <div className="text-xs text-ink-muted font-mono">
                          {card.cardType} • Exp: {card.expiryMonth}/{card.expiryYear}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                        card.status === 'ACTIVE'
                          ? 'bg-success/20 text-success border-success/30'
                          : 'bg-gold/20 text-gold border-gold/30'
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>

                  {/* Visual Card Display */}
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#0B0D12] via-[#141822] to-[#1E1B4B] border border-glass-border shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-xs tracking-widest text-gold">
                        NOVABANK
                      </span>
                      <Zap className="h-4 w-4 text-gold" />
                    </div>
                    <div className="font-mono text-base tracking-widest text-ink font-bold">{card.maskedPan}</div>
                    <div className="flex justify-between items-end text-xs text-ink-muted font-mono">
                      <div>
                        <div className="text-ink-faint uppercase text-xs font-semibold">Cardholder</div>
                        <div className="font-bold text-ink">{card.cardholderName}</div>
                      </div>
                      <div>
                        <div className="text-ink-faint uppercase text-xs font-semibold">Status</div>
                        <div className="font-bold text-success">READY</div>
                      </div>
                    </div>
                  </div>

                  {/* Spending Progress */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-ink-muted">Daily Limit Spent</span>
                      <span className="text-ink font-mono">
                        ${card.spentTodayUSD} / ${card.spendLimitDailyUSD} USD ({spendPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface border border-glass-border overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-violet"
                        style={{ width: `${spendPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={onOpenTestModal}
                      className="flex-1 py-2 rounded-xl bg-success/20 text-success border border-success/30 font-bold text-xs hover:bg-success/30 transition-all text-center"
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
          <div className="glass-card rounded-2xl p-6 border border-glass-border space-y-4">
            <h3 className="text-sm font-bold text-ink font-display flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" /> Card Security Rules
            </h3>
            <ul className="space-y-3 text-xs text-ink-muted">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5" />
                <span>Zero cross-border FX markup on international POS purchases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5" />
                <span>Tiered interchange fees: $0.10 (&le;$500), $0.50 ($500-$1000), $1.00 (&gt;$1000).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5" />
                <span>Instant balance deduction from USD fiat or auto-conversion from crypto.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
