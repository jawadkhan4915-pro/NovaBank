import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Clock, ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { CryptoCurrency, LockedQuote } from '@novabank/shared';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<string, number>;
  onSuccess: () => void;
  onOpenKyc?: () => void;
}

export const ConvertModal: React.FC<ConvertModalProps> = ({
  isOpen,
  onClose,
  balances,
  onSuccess,
  onOpenKyc,
}) => {
  const { user } = useAuthStore();
  const [fromAsset, setFromAsset] = useState<CryptoCurrency>('BTC');
  const [amount, setAmount] = useState('0.1');
  const [quote, setQuote] = useState<LockedQuote | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [msg, setMsg] = useState('');
  const [kycError, setKycError] = useState('');

  useEffect(() => {
    let timer: any;
    if (quote) {
      const updateTimer = () => {
        const remaining = Math.max(0, Math.ceil((quote.expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          setQuote(null);
        }
      };
      updateTimer();
      timer = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timer);
  }, [quote]);

  if (!isOpen) return null;

  const isKycVerified = user?.kycStatus === 'VERIFIED';
  const userBalance = balances[fromAsset] || 0;

  const handleRequestQuote = async () => {
    if (!isKycVerified) {
      setKycError('KYC Verification Required: You must complete Tier-3 Identity Verification before executing crypto-to-fiat conversions.');
      return;
    }

    try {
      setLoadingQuote(true);
      setMsg('');
      setKycError('');
      const res = await api.post('/conversion/quote', {
        fromCurrency: fromAsset,
        amount: parseFloat(amount),
      });
      if (res.data.success) {
        setQuote(res.data.data);
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Failed to generate conversion quote');
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleExecuteConversion = async () => {
    if (!quote) return;
    if (!isKycVerified) {
      setKycError('KYC Verification Required: Please complete identity verification.');
      return;
    }

    try {
      setExecuting(true);
      setMsg('');
      setKycError('');
      const res = await api.post('/conversion/execute', {
        quoteId: quote.quoteId,
      });

      if (res.data.success) {
        setMsg(`Success! Converted ${quote.fromAmount} ${quote.fromCurrency} to $${quote.toAmountUSD} USD.`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          setQuote(null);
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Conversion execution failed');
    } finally {
      setExecuting(false);
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
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Convert Crypto to USD</h3>
            <p className="text-xs text-ink-muted">Guaranteed 15-second locked market rate quote</p>
          </div>
        </div>

        {/* KYC Missing Requirement Notice */}
        {!isKycVerified && (
          <div className="mb-4 p-3.5 rounded-xl bg-danger/15 border border-danger/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-danger font-bold">
              <ShieldAlert className="h-4 w-4" />
              <span>KYC Requirement Missing</span>
            </div>
            <p className="text-ink-muted text-[11px] leading-relaxed">
              Regulatory compliance requires identity verification to swap assets. Complete CNIC, SIM & Face Scan to unlock.
            </p>
            {onOpenKyc && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenKyc();
                }}
                className="w-full py-2 rounded-lg bg-gold hover:bg-gold-dim text-background font-bold text-xs transition-all shadow-sm"
              >
                Complete KYC Verification Now
              </button>
            )}
          </div>
        )}

        {kycError && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{kycError}</span>
          </div>
        )}

        {/* Input Form */}
        <div className="space-y-4 mb-5">
          <div>
            <div className="flex justify-between text-xs text-ink-muted mb-1 font-medium font-mono">
              <span>Pay Crypto</span>
              <span>Available: {userBalance} {fromAsset}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-glass-border">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setQuote(null);
                }}
                className="w-full bg-transparent text-ink font-mono font-bold text-lg focus:outline-none"
              />
              <select
                value={fromAsset}
                onChange={(e) => {
                  setFromAsset(e.target.value as CryptoCurrency);
                  setQuote(null);
                }}
                className="bg-surface text-ink font-mono font-bold text-xs rounded-xl px-2.5 py-1.5 border border-glass-border focus:outline-none"
              >
                {['BTC', 'ETH', 'BNB', 'SOL', 'BCH'].map((c) => (
                  <option key={c} value={c} className="bg-background text-ink">{c}</option>
                ))}
              </select>
            </div>
          </div>

          {!quote ? (
            <button
              onClick={handleRequestQuote}
              disabled={loadingQuote}
              className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all"
            >
              {loadingQuote ? 'Locking Live Quote...' : 'Get Locked Quote'}
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-surface border border-violet/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-ink">
                <span className="flex items-center gap-1 text-violet">
                  <ShieldCheck className="h-4 w-4" /> Quote Locked
                </span>
                <span className="flex items-center gap-1 text-gold font-mono">
                  <Clock className="h-3.5 w-3.5" /> {timeLeft}s remaining
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-glass-border pt-2">
                <span className="text-xs text-ink-muted">Receive USD</span>
                <span className="text-xl font-mono font-bold text-success">${quote.toAmountUSD} USD</span>
              </div>

              <div className="text-xs text-ink-muted flex justify-between font-mono">
                <span>Rate: 1 {quote.fromCurrency} = ${quote.exchangeRate} USD</span>
                <span>Fee: $0.00</span>
              </div>

              <button
                onClick={handleExecuteConversion}
                disabled={executing}
                className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background transition-all shadow-gold-glow"
              >
                {executing ? 'Executing Conversion...' : 'Confirm Conversion Now'}
              </button>
            </div>
          )}
        </div>

        {msg && <p className="text-xs text-center font-mono font-semibold text-success">{msg}</p>}
      </div>
    </div>
  );
};
