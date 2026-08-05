import React, { useState } from 'react';
import { X, ArrowUpRight, ShieldCheck, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Currency } from '@novabank/shared';
import { api } from '../../lib/api';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<string, number>;
  onSuccess: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  balances,
  onSuccess,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('150.00');
  const [destination, setDestination] = useState('');
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

  const handleWithdraw = async () => {
    if (!destination.trim()) {
      setErrorMsg('Please enter a destination wallet address or bank account details.');
      return;
    }
    if (!hasEnough) {
      setErrorMsg(`Insufficient ${selectedCurrency} balance to cover withdrawal amount + fee.`);
      return;
    }

    try {
      setLoading(true);
      setMsg('');
      setErrorMsg('');

      const res = await api.post('/wallets/withdraw', {
        currency: selectedCurrency,
        amount: numAmount,
        destinationAddress: destination,
      });

      if (res.data.success) {
        setMsg(`Withdrawal of ${numAmount} ${selectedCurrency} processed successfully!`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Withdrawal failed. Check inputs.');
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
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Withdraw Funds</h3>
            <p className="text-xs text-ink-muted">Transfer assets out to external bank or crypto wallet</p>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Select Asset</label>
            <div className="grid grid-cols-6 gap-1 p-1 bg-surface rounded-xl border border-glass-border">
              {(['USD', 'BTC', 'ETH', 'BNB', 'SOL', 'BCH'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedCurrency === curr
                      ? 'bg-gold text-background shadow-gold-glow'
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
            <label className="text-xs font-semibold text-ink-muted block mb-1">Withdrawal Amount</label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-ink focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Destination Address / Bank IBAN</label>
            <input
              type="text"
              placeholder="External Wallet Address or IBAN Account Number"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-xs font-mono text-ink focus:outline-none focus:border-gold"
            />
          </div>

          {/* Fee Schedule Summary */}
          <div className="p-3 rounded-xl bg-surface border border-glass-border space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-muted">
              <span>Applied Fee Schedule:</span>
              <span className="font-mono font-bold text-gold">
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
            onClick={handleWithdraw}
            disabled={loading || !hasEnough}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background transition-all shadow-gold-glow disabled:opacity-50"
          >
            {loading ? 'Processing Withdrawal...' : `Confirm Withdrawal (${selectedCurrency})`}
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
