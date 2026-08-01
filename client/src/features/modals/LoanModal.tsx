import React, { useState } from 'react';
import { X, Landmark, Percent, ShieldCheck, AlertCircle } from 'lucide-react';
import { CryptoCurrency, LoanDetails } from '@novabank/shared';
import { api } from '../../lib/api';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<string, number>;
  activeLoans: LoanDetails[];
  onSuccess: () => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({ isOpen, onClose, balances, activeLoans, onSuccess }) => {
  const [tab, setTab] = useState<'apply' | 'repay'>('apply');

  // Application State
  const [collateralAsset, setCollateralAsset] = useState<CryptoCurrency>('BTC');
  const [collateralAmount, setCollateralAmount] = useState('0.5');
  const [requestedUSD, setRequestedUSD] = useState('15000');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Repayment State
  const [selectedLoanId, setSelectedLoanId] = useState<string>(activeLoans[0]?.id || '');
  const [repaymentUSD, setRepaymentUSD] = useState('1000');

  if (!isOpen) return null;

  // Mock live rates for LTV preview calculation
  const mockRates: Record<CryptoCurrency, number> = { BTC: 65000, ETH: 3500, BNB: 580, SOL: 145, BCH: 450 };
  const rate = mockRates[collateralAsset] || 1;
  const colVal = (parseFloat(collateralAmount) || 0) * rate;
  const reqVal = parseFloat(requestedUSD) || 0;
  const computedLtv = colVal > 0 ? (reqVal / colVal) * 100 : 0;
  const maxAllowedUSD = Math.floor(colVal * 0.50); // 50% max LTV limit

  const handleApplyLoan = async () => {
    try {
      setLoading(true);
      setMsg('');
      const res = await api.post('/loans/apply', {
        collateralAsset,
        collateralAmount: parseFloat(collateralAmount),
        requestedLoanUSD: parseFloat(requestedUSD),
      });

      if (res.data.success) {
        setMsg(`Loan approved! $${requestedUSD} USD disbursed to your wallet balance.`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Loan application failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRepayLoan = async () => {
    try {
      setLoading(true);
      setMsg('');
      const res = await api.post('/loans/repay', {
        loanId: selectedLoanId || activeLoans[0]?.id,
        repaymentUSD: parseFloat(repaymentUSD),
      });

      if (res.data.success) {
        setMsg(`Repayment successful! Collateral released back to your wallet.`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Repayment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg glass-card rounded-2xl border border-white/20 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-aurora-violet/10 text-aurora-violet border border-aurora-violet/20">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Crypto-Collateralized Loans</h3>
            <p className="text-xs text-slate-400">Lock crypto collateral, receive instant USD without selling</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-5">
          <button
            onClick={() => setTab('apply')}
            className={`w-1/2 py-2 rounded-lg font-bold text-xs transition-all ${
              tab === 'apply' ? 'bg-aurora-violet text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Apply New Loan
          </button>
          <button
            onClick={() => setTab('repay')}
            className={`w-1/2 py-2 rounded-lg font-bold text-xs transition-all ${
              tab === 'repay' ? 'bg-aurora-violet text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Repay Active Loan
          </button>
        </div>

        {tab === 'apply' ? (
          <div className="space-y-4 mb-5">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Select Collateral Asset</span>
                <span>Available: {balances[collateralAsset] || 0} {collateralAsset}</span>
              </div>
              <div className="flex gap-2">
                <select
                  value={collateralAsset}
                  onChange={(e) => setCollateralAsset(e.target.value as CryptoCurrency)}
                  className="bg-black/40 border border-white/10 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none"
                >
                  {['BTC', 'ETH', 'BNB', 'SOL', 'BCH'].map((c) => (
                    <option key={c} value={c} className="bg-[#0A0A0F] text-white">{c}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Requested USD Loan Amount</span>
                <span className="text-emerald-400">Max 50% LTV: ${maxAllowedUSD} USD</span>
              </div>
              <input
                type="number"
                step="100"
                value={requestedUSD}
                onChange={(e) => setRequestedUSD(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-base font-extrabold text-white focus:outline-none"
              />
            </div>

            {/* LTV Meter */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Calculated LTV Ratio</span>
                <span className={computedLtv > 50 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {computedLtv.toFixed(1)}% / 50% Max
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    computedLtv > 50 ? 'bg-red-500' : 'bg-gradient-to-r from-aurora-cyan to-aurora-emerald'
                  }`}
                  style={{ width: `${Math.min(100, computedLtv)}%` }}
                />
              </div>
              {computedLtv > 50 && (
                <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3 w-3" /> Requested loan exceeds 50% max LTV limit!
                </p>
              )}
            </div>

            <button
              onClick={handleApplyLoan}
              disabled={loading || computedLtv > 50}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-emerald font-bold text-sm text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? 'Processing Application...' : 'Approve & Disburse USD'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-5">
            {activeLoans.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No active loans found to repay</div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Select Active Loan</label>
                  <select
                    value={selectedLoanId || activeLoans[0]?.id}
                    onChange={(e) => setSelectedLoanId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {activeLoans.map((l) => (
                      <option key={l.id} value={l.id} className="bg-[#0A0A0F] text-white">
                        {l.collateralAsset} Collateral — ${l.disbursedAmountUSD} USD (Status: {l.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Repayment USD Amount</label>
                  <input
                    type="number"
                    step="100"
                    value={repaymentUSD}
                    onChange={(e) => setRepaymentUSD(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-base font-bold text-white focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex justify-between">
                  <span className="text-slate-400">Loan Repayment Flat Fee:</span>
                  <span className="font-bold text-aurora-cyan">$1.00 USD</span>
                </div>

                <button
                  onClick={handleRepayLoan}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-sm text-white transition-all shadow-lg"
                >
                  {loading ? 'Processing Repayment...' : 'Confirm Loan Repayment'}
                </button>
              </>
            )}
          </div>
        )}

        {msg && <p className="text-xs text-center font-semibold text-emerald-400">{msg}</p>}
      </div>
    </div>
  );
};
