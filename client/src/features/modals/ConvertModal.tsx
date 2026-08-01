import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Clock, ShieldCheck } from 'lucide-react';
import { CryptoCurrency, LockedQuote } from '@novabank/shared';
import { api } from '../../lib/api';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<string, number>;
  onSuccess: () => void;
}

export const ConvertModal: React.FC<ConvertModalProps> = ({ isOpen, onClose, balances, onSuccess }) => {
  const [fromAsset, setFromAsset] = useState<CryptoCurrency>('BTC');
  const [amount, setAmount] = useState('0.1');
  const [quote, setQuote] = useState<LockedQuote | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [msg, setMsg] = useState('');

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

  const userBalance = balances[fromAsset] || 0;

  const handleRequestQuote = async () => {
    try {
      setLoadingQuote(true);
      setMsg('');
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
    try {
      setExecuting(true);
      setMsg('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md glass-card rounded-2xl border border-white/20 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-aurora-violet/10 text-aurora-violet border border-aurora-violet/20">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Convert Crypto to USD</h3>
            <p className="text-xs text-slate-400">Guaranteed 15-second locked market rate quote</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4 mb-5">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
              <span>Pay Crypto</span>
              <span>Available: {userBalance} {fromAsset}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setQuote(null);
                }}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
              <select
                value={fromAsset}
                onChange={(e) => {
                  setFromAsset(e.target.value as CryptoCurrency);
                  setQuote(null);
                }}
                className="bg-white/10 text-white font-semibold text-xs rounded-lg px-2.5 py-1.5 border border-white/10 focus:outline-none"
              >
                {['BTC', 'ETH', 'BNB', 'SOL', 'BCH'].map((c) => (
                  <option key={c} value={c} className="bg-[#0A0A0F] text-white">{c}</option>
                ))}
              </select>
            </div>
          </div>

          {!quote ? (
            <button
              onClick={handleRequestQuote}
              disabled={loadingQuote}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-aurora-violet to-aurora-cyan hover:opacity-90 font-bold text-sm text-white shadow-lg transition-all"
            >
              {loadingQuote ? 'Locking Live Quote...' : 'Get Locked Quote'}
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-br from-aurora-violet/20 to-aurora-cyan/10 border border-aurora-violet/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1 text-aurora-cyan">
                  <ShieldCheck className="h-4 w-4" /> Quote Locked
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-mono">
                  <Clock className="h-3.5 w-3.5" /> {timeLeft}s remaining
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-white/10 pt-2">
                <span className="text-xs text-slate-400">Receive USD</span>
                <span className="text-xl font-black text-emerald-400 tabular-nums">${quote.toAmountUSD} USD</span>
              </div>

              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>Rate: 1 {quote.fromCurrency} = ${quote.exchangeRate} USD</span>
                <span>Fee: $0.00</span>
              </div>

              <button
                onClick={handleExecuteConversion}
                disabled={executing}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-white transition-all shadow-md"
              >
                {executing ? 'Executing Conversion...' : 'Confirm Conversion Now'}
              </button>
            </div>
          )}
        </div>

        {msg && <p className="text-xs text-center font-semibold text-emerald-400">{msg}</p>}
      </div>
    </div>
  );
};
