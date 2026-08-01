import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ArrowDownRight, Sparkles } from 'lucide-react';
import { CryptoCurrency } from '@novabank/shared';
import { api } from '../../lib/api';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAddresses: Record<string, string>;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, depositAddresses, onSuccess }) => {
  const [selectedAsset, setSelectedAsset] = useState<CryptoCurrency>('BTC');
  const [copied, setCopied] = useState(false);
  const [depositAmount, setDepositAmount] = useState('0.1');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const currentAddress = depositAddresses[selectedAsset] || 'bc1qdemo...address';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDeposit = async () => {
    try {
      setLoading(true);
      setMsg('');
      const res = await api.post('/wallets/deposit/simulate', {
        currency: selectedAsset,
        amount: parseFloat(depositAmount),
      });

      if (res.data.success) {
        setMsg(`Simulated deposit of ${depositAmount} ${selectedAsset} confirmed on-chain!`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Deposit simulation failed');
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
          <div className="p-2.5 rounded-xl bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Deposit Crypto</h3>
            <p className="text-xs text-slate-400">Receive external transfers via deposit address</p>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="grid grid-cols-5 gap-1.5 mb-5 p-1 bg-white/5 rounded-xl border border-white/10">
          {(['BTC', 'ETH', 'BNB', 'SOL', 'BCH'] as CryptoCurrency[]).map((asset) => (
            <button
              key={asset}
              onClick={() => setSelectedAsset(asset)}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedAsset === asset
                  ? 'bg-aurora-violet text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {asset}
            </button>
          ))}
        </div>

        {/* QR & Address Card */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center mb-5">
          <div className="h-32 w-32 bg-white p-2 rounded-xl flex items-center justify-center mb-3">
            <QrCode className="h-28 w-28 text-slate-900" />
          </div>
          <div className="w-full text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Your {selectedAsset} Address</span>
            <div className="mt-1 flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs font-mono text-aurora-cyan truncate max-w-[240px]">{currentAddress}</span>
              <button onClick={handleCopy} className="p-1 text-slate-400 hover:text-white">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sandbox Mock Deposit Trigger */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-aurora-cyan" /> Instant Test Deposit Simulator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            />
            <button
              onClick={handleSimulateDeposit}
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-aurora-cyan to-aurora-violet hover:opacity-90 font-semibold text-xs text-white whitespace-nowrap"
            >
              {loading ? 'Confirming...' : `Deposit ${selectedAsset}`}
            </button>
          </div>
          {msg && <p className="text-[11px] text-center font-medium text-emerald-400 mt-1">{msg}</p>}
        </div>
      </div>
    </div>
  );
};
