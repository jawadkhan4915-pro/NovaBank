import React, { useState } from 'react';
import { X, Send, ShieldCheck, Zap, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { Currency } from '@novabank/shared';
import { api } from '../../lib/api';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<string, number>;
  onSuccess: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  balances,
  onSuccess,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('100.00');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentBalance = balances[selectedCurrency] || 0;
  const numAmount = parseFloat(amount) || 0;

  // Live Tiered Fee Engine Calculation ($0.10 <= $500, $0.50 <= $1000, $1.00 > $1000)
  const ratesUSD: Record<string, number> = { USD: 1, BTC: 65000, ETH: 3500, BNB: 580, SOL: 145, BCH: 450 };
  const rate = ratesUSD[selectedCurrency] || 1;
  const estAmountUSD = numAmount * rate;

  let feeUSD = 0.10;
  let feeTierLabel = '(≤$500)';
  if (estAmountUSD > 1000) {
    feeUSD = 1.00;
    feeTierLabel = '(>$1000)';
  } else if (estAmountUSD > 500) {
    feeUSD = 0.50;
    feeTierLabel = '($500-$1K)';
  }

  const feeInCurrency = selectedCurrency === 'USD' ? feeUSD : Math.round((feeUSD / rate) * 100000000) / 100000000;
  const totalNeeded = numAmount + feeInCurrency;
  const hasEnough = currentBalance >= totalNeeded;

  const handleTransfer = async () => {
    if (!recipient.trim()) {
      setErrorMsg('Please enter a recipient Email address or NovaBank Bank ID Number.');
      return;
    }
    if (!hasEnough) {
      setErrorMsg(`Insufficient ${selectedCurrency} balance to cover transfer amount + fee.`);
      return;
    }

    try {
      setLoading(true);
      setMsg('');
      setErrorMsg('');

      const res = await api.post('/wallets/transfer', {
        recipientIdentifier: recipient,
        currency: selectedCurrency,
        amount: numAmount,
        note,
      });

      if (res.data.success) {
        const data = res.data.data;
        setMsg(`Instant P2P Transfer of ${numAmount} ${selectedCurrency} to ${data.recipientName} completed!`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Transfer failed. Verify recipient ID.');
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
          <div className="p-2.5 rounded-xl bg-violet/15 text-violet border border-violet/30">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">P2P User Transfer</h3>
            <p className="text-xs text-ink-muted">Instant internal transfer via Email or Bank ID Number</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Recipient Email or Bank ID Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. user@novabank.io or NB-84920"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-background border border-glass-border rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono text-ink focus:outline-none focus:border-violet"
              />
              <UserCheck className="h-4 w-4 text-ink-muted absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Select Asset</label>
            <div className="grid grid-cols-6 gap-1 p-1 bg-surface rounded-xl border border-glass-border">
              {(['USD', 'BTC', 'ETH', 'BNB', 'SOL', 'BCH'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedCurrency === curr
                      ? 'bg-violet text-white shadow-violet-glow'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-ink-muted mt-1 font-mono">
              <span>Available Balance:</span>
              <span className="text-ink font-bold">{currentBalance} {selectedCurrency}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Transfer Amount</label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-ink focus:outline-none focus:border-violet"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Transfer Memo / Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Payment for services / gift"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-violet"
            />
          </div>

          {/* Fee Schedule Summary */}
          <div className="p-3 rounded-xl bg-surface border border-glass-border space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-muted">
              <span>Applied Fee Schedule:</span>
              <span className="font-mono font-bold text-violet">
                ${feeUSD.toFixed(2)} USD {feeTierLabel}
              </span>
            </div>
            <div className="flex justify-between text-ink font-semibold border-t border-glass-border pt-1.5 font-mono">
              <span>Total Debited:</span>
              <span>
                {selectedCurrency === 'USD' 
                  ? `$${totalNeeded.toFixed(2)} USD`
                  : `${totalNeeded.toFixed(6)} ${selectedCurrency}`}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleTransfer}
            disabled={loading || !hasEnough}
            className="w-full py-3 rounded-xl bg-violet hover:bg-violet-dim font-bold text-xs text-white transition-all shadow-violet-glow disabled:opacity-50"
          >
            {loading ? 'Executing Transfer...' : `Send P2P Transfer (${selectedCurrency})`}
          </button>
        </div>

        {msg && (
          <div className="p-3 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-mono font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
