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

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentAddress)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-hero rounded-2xl border border-glass-border p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-muted hover:text-ink">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gold/15 text-gold border border-gold/30">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Deposit Crypto</h3>
            <p className="text-xs text-ink-muted">Scan QR code or copy address to deposit funds</p>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="grid grid-cols-5 gap-1.5 mb-5 p-1 bg-surface rounded-xl border border-glass-border">
          {(['BTC', 'ETH', 'BNB', 'SOL', 'BCH'] as CryptoCurrency[]).map((asset) => (
            <button
              key={asset}
              onClick={() => setSelectedAsset(asset)}
              className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedAsset === asset
                  ? 'bg-violet text-white shadow-violet-glow'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
              }`}
            >
              {asset}
            </button>
          ))}
        </div>

        {/* Dynamic QR & Address Card */}
        <div className="p-4 rounded-xl bg-background border border-glass-border flex flex-col items-center mb-5">
          <div className="h-36 w-36 bg-white p-2 rounded-2xl flex items-center justify-center mb-3 shadow-md border border-gold/20">
            <img
              src={qrCodeUrl}
              alt={`${selectedAsset} Deposit QR Code`}
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <div className="w-full text-center">
            <span className="text-xs text-ink-muted uppercase font-semibold">Your Auto-Generated {selectedAsset} Address</span>
            <div className="mt-1 flex items-center justify-between p-2 rounded-xl bg-surface border border-glass-border">
              <span className="text-xs font-mono text-gold truncate max-w-[240px]">{currentAddress}</span>
              <button onClick={handleCopy} className="p-1 text-ink-muted hover:text-ink" title="Copy Address">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sandbox Mock Deposit Trigger */}
        <div className="p-3.5 rounded-xl bg-surface border border-glass-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Instant Test Deposit Simulator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-gold"
            />
            <button
              onClick={handleSimulateDeposit}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background whitespace-nowrap shadow-gold-glow"
            >
              {loading ? 'Confirming...' : `Deposit ${selectedAsset}`}
            </button>
          </div>
          {msg && <p className="text-xs text-center font-medium font-mono text-success mt-1">{msg}</p>}
        </div>
      </div>
    </div>
  );
};
