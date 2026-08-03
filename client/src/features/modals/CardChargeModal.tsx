import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { CardDetails, CardTransactionResponse } from '@novabank/shared';
import { api } from '../../lib/api';

interface CardChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CardDetails[];
  onSuccess: () => void;
}

export const CardChargeModal: React.FC<CardChargeModalProps> = ({ isOpen, onClose, cards, onSuccess }) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [amountUSD, setAmountUSD] = useState('250.00');
  const [merchantName, setMerchantName] = useState('Apple Store Fifth Ave');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CardTransactionResponse | null>(null);

  if (!isOpen) return null;

  // Calculate expected fee preview client-side to show live fee table rule feedback
  const amt = parseFloat(amountUSD) || 0;
  let expectedFee = 0.10;
  if (amt > 1000) expectedFee = 1.00;
  else if (amt > 500) expectedFee = 0.50;

  const handleSimulateCharge = async () => {
    try {
      setLoading(true);
      setResult(null);
      const targetCard = selectedCardId || cards[0]?.id;
      const res = await api.post('/cards/simulate-charge', {
        cardId: targetCard,
        amountUSD: amt,
        merchantName,
      });

      if (res.data.success) {
        setResult(res.data.data);
        onSuccess();
      }
    } catch (err: any) {
      setResult({
        approved: false,
        amountUSD: amt,
        feeAppliedUSD: 0,
        totalDebitedUSD: 0,
        reason: err.response?.data?.error?.message || 'Charge simulation failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-hero rounded-2xl border border-glass-border p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-muted hover:text-ink">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gold/15 text-gold border border-gold/30">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">POS Card Charge Simulator</h3>
            <p className="text-xs text-ink-muted">Test real-time spend authorization & server Fee Engine rules</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Select Card</label>
            <select
              value={selectedCardId || cards[0]?.id}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-xs font-mono text-ink focus:outline-none focus:border-gold"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id} className="bg-background text-ink">
                  {c.cardType} — {c.maskedPan} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Merchant Name</label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Transaction Amount ($ USD)</label>
            <input
              type="number"
              step="10"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-ink focus:outline-none focus:border-gold"
            />
          </div>

          {/* Fee Table Rule Indicator */}
          <div className="p-3 rounded-xl bg-surface border border-glass-border text-xs flex justify-between items-center">
            <span className="text-ink-muted font-medium">Applied Server Fee Tier:</span>
            <span className="font-mono font-bold text-gold">
              ${expectedFee.toFixed(2)} USD {amt <= 500 ? '(≤$500)' : amt <= 1000 ? '($500-$1K)' : '(>$1K)'}
            </span>
          </div>

          <button
            onClick={handleSimulateCharge}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background transition-all shadow-gold-glow"
          >
            {loading ? 'Authorizing Card Transaction...' : 'Simulate POS Swipe'}
          </button>
        </div>

        {/* Transaction Result Payload */}
        {result && (
          <div
            className={`p-4 rounded-xl border ${
              result.approved
                ? 'bg-success/10 border-success/30 text-success'
                : 'bg-danger/10 border-danger/30 text-danger'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs mb-1">
              <span>Status: {result.approved ? 'APPROVED ✓' : 'DECLINED ✗'}</span>
              <span className="font-mono">Total Debited: ${result.totalDebitedUSD} USD</span>
            </div>
            {result.approved ? (
              <div className="text-xs space-y-0.5 opacity-90 font-mono">
                <div>Charge: ${result.amountUSD} USD</div>
                <div>Fee Engine Deduction: ${result.feeAppliedUSD} USD</div>
                <div className="font-mono text-xs truncate">Tx Ref: {result.transactionId}</div>
              </div>
            ) : (
              <div className="text-xs opacity-90">{result.reason}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
