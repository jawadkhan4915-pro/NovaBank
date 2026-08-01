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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md glass-card rounded-2xl border border-white/20 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-aurora-emerald/10 text-aurora-emerald border border-aurora-emerald/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">POS Card Charge Simulator</h3>
            <p className="text-xs text-slate-400">Test real-time spend authorization & server Fee Engine rules</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Select Card</label>
            <select
              value={selectedCardId || cards[0]?.id}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0A0A0F] text-white">
                  {c.cardType} — {c.maskedPan} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Merchant Name</label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Transaction Amount ($ USD)</label>
            <input
              type="number"
              step="10"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-base font-bold text-white focus:outline-none"
            />
          </div>

          {/* Fee Table Rule Indicator */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex justify-between items-center">
            <span className="text-slate-400 font-medium">Applied Server Fee Tier:</span>
            <span className="font-bold text-aurora-cyan">
              ${expectedFee.toFixed(2)} USD {amt <= 500 ? '(≤$500)' : amt <= 1000 ? '($500-$1K)' : '(>$1K)'}
            </span>
          </div>

          <button
            onClick={handleSimulateCharge}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-aurora-emerald via-aurora-cyan to-aurora-violet font-bold text-sm text-white hover:opacity-90 transition-all shadow-lg"
          >
            {loading ? 'Authorizing Card Transaction...' : 'Simulate POS Swipe'}
          </button>
        </div>

        {/* Transaction Result Payload */}
        {result && (
          <div
            className={`p-4 rounded-xl border ${
              result.approved
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs mb-1">
              <span>Status: {result.approved ? 'APPROVED ✓' : 'DECLINED ✗'}</span>
              <span>Total Debited: ${result.totalDebitedUSD} USD</span>
            </div>
            {result.approved ? (
              <div className="text-[11px] space-y-0.5 opacity-90">
                <div>Charge: ${result.amountUSD} USD</div>
                <div>Fee Engine Deduction: ${result.feeAppliedUSD} USD</div>
                <div className="font-mono text-[10px] truncate">Tx Ref: {result.transactionId}</div>
              </div>
            ) : (
              <div className="text-[11px] opacity-90">{result.reason}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
