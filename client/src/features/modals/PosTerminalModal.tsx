import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ShoppingBag,
  ShieldCheck,
  Zap,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Store,
  Sparkles,
  Printer,
  ArrowRight,
  Smartphone,
  Check,
} from 'lucide-react';
import { CardDetails, CardTransactionResponse } from '@novabank/shared';
import { api } from '../../lib/api';

interface PosTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards?: CardDetails[];
  initialCardId?: string;
  onSuccess?: () => void;
}

interface MallMerchantPreset {
  id: string;
  name: string;
  category: string;
  mcc: string;
  amountUSD: number;
  icon: string;
}

const MALL_MERCHANT_PRESETS: MallMerchantPreset[] = [
  {
    id: 'dept_store',
    name: 'Grand Shopping Mall — Department Store',
    category: 'Shopping Mall Retail',
    mcc: '5311',
    amountUSD: 250.00,
    icon: '🛍️',
  },
  {
    id: 'apple_store',
    name: 'Apple Store — Fifth Ave Tech Accessories',
    category: 'Consumer Electronics',
    mcc: '5732',
    amountUSD: 1299.00,
    icon: '🍏',
  },
  {
    id: 'mall_cafe',
    name: 'Mall Gourmet Cafe & Bistro',
    category: 'Dining & Beverages',
    mcc: '5812',
    amountUSD: 38.50,
    icon: '☕',
  },
  {
    id: 'fashion_boutique',
    name: 'Luxury Fashion & Designer Boutique',
    category: 'Apparel & Accessories',
    mcc: '5651',
    amountUSD: 480.00,
    icon: '👕',
  },
];

// Web Audio API POS Beep Synthesizer for Terminal Sound Feedback
const playTerminalBeep = (type: 'scan' | 'approved' | 'declined') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'scan') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'approved') {
      // Two-tone cheerful success beep
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
      osc2.frequency.setValueAtTime(1318.5, ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.08);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.25);
    } else if (type === 'declined') {
      // Low double buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Silent catch if audio blocked
  }
};

export const PosTerminalModal: React.FC<PosTerminalModalProps> = ({
  isOpen,
  onClose,
  cards = [],
  initialCardId,
  onSuccess,
}) => {
  const [selectedMerchant, setSelectedMerchant] = useState<MallMerchantPreset>(MALL_MERCHANT_PRESETS[0]);
  const [isCustomMerchant, setIsCustomMerchant] = useState(false);
  const [customMerchantName, setCustomMerchantName] = useState('Grand Mall Retail POS');
  const [customAmount, setCustomAmount] = useState('150.00');
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId || cards[0]?.id || '');

  // Payment Scan Stages: 'idle' | 'scanning' | 'authenticating' | 'completed'
  const [stage, setStage] = useState<'idle' | 'scanning' | 'authenticating' | 'completed'>('idle');
  const [stageMessage, setStageMessage] = useState('');
  const [result, setResult] = useState<CardTransactionResponse | null>(null);

  useEffect(() => {
    if (initialCardId) setSelectedCardId(initialCardId);
    else if (cards.length > 0 && !selectedCardId) setSelectedCardId(cards[0].id);
  }, [initialCardId, cards]);

  if (!isOpen) return null;

  const currentAmount = isCustomMerchant ? parseFloat(customAmount) || 0 : selectedMerchant.amountUSD;
  const currentMerchantName = isCustomMerchant ? customMerchantName : selectedMerchant.name;

  // Expected Fee Calculation ($0.10 for <=$500, $0.50 for $500-$1K, $1.00 for >$1K)
  let expectedFee = 0.10;
  if (currentAmount > 1000) expectedFee = 1.00;
  else if (currentAmount > 500) expectedFee = 0.50;

  const handleStartChipPayment = async () => {
    setStage('scanning');
    setStageMessage('Reading EMV Microchip Cryptographic Keys...');
    playTerminalBeep('scan');

    setTimeout(() => {
      setStage('authenticating');
      setStageMessage('Authenticating with NovaBank Private Ledger...');
      playTerminalBeep('scan');

      setTimeout(async () => {
        try {
          const targetCardId = selectedCardId || cards[0]?.id;
          if (targetCardId) {
            const res = await api.post('/cards/simulate-charge', {
              cardId: targetCardId,
              amountUSD: currentAmount,
              merchantName: currentMerchantName,
            });

            if (res.data.success) {
              setResult(res.data.data);
              playTerminalBeep('approved');
              if (onSuccess) onSuccess();
            } else {
              setResult({
                approved: false,
                amountUSD: currentAmount,
                feeAppliedUSD: 0,
                totalDebitedUSD: 0,
                reason: res.data.error?.message || 'Transaction Declined by Bank',
              });
              playTerminalBeep('declined');
            }
          } else {
            // Demo Sandbox Mode fallback transaction response
            setResult({
              approved: true,
              amountUSD: currentAmount,
              feeAppliedUSD: expectedFee,
              totalDebitedUSD: Math.round((currentAmount + expectedFee) * 100) / 100,
              transactionId: `NVB_POS_DEMO_${Math.floor(100000 + Math.random() * 900000)}`,
            });
            playTerminalBeep('approved');
            if (onSuccess) onSuccess();
          }
        } catch (err: any) {
          setResult({
            approved: false,
            amountUSD: currentAmount,
            feeAppliedUSD: 0,
            totalDebitedUSD: 0,
            reason: err.response?.data?.error?.message || 'EMV Chip authorization rejected',
          });
          playTerminalBeep('declined');
        } finally {
          setStage('completed');
        }
      }, 1000);
    }, 900);
  };

  const handleReset = () => {
    setStage('idle');
    setResult(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-hero rounded-3xl border border-gold/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-muted hover:text-ink transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gold/15 text-gold border border-gold/30 shadow-gold-glow">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-xl text-ink">Shopping Mall POS Terminal</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">
                EMV CHIP ACTIVE
              </span>
            </div>
            <p className="text-xs text-ink-muted">Scan virtual card chip or tap NFC wave to authorize merchant payment</p>
          </div>
        </div>

        {stage !== 'completed' ? (
          <div className="space-y-5">
            {/* 1. Terminal Screen LCD Display */}
            <div className="p-4 rounded-2xl bg-[#090C12] border border-gold/40 shadow-inner space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-gold/20 pb-2 text-xs font-mono">
                <span className="text-gold font-bold flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 animate-pulse" /> NOVABANK POS v4.2
                </span>
                <span className="text-ink-muted">MCC: {isCustomMerchant ? '5999' : selectedMerchant.mcc}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="text-[11px] font-mono text-ink-muted uppercase">Merchant Store</div>
                  <div className="text-sm font-bold text-ink">{currentMerchantName}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[11px] text-ink-muted uppercase">Terminal Total</div>
                  <div className="text-xl font-bold text-gold">${currentAmount.toFixed(2)} USD</div>
                </div>
              </div>

              {/* Terminal Screen Live Status Line */}
              <div className="p-2.5 rounded-xl bg-background/80 border border-glass-border flex items-center justify-between text-xs font-mono">
                <span className="text-ink-muted">Terminal Status:</span>
                <span className="text-success font-bold animate-pulse">
                  {stage === 'idle'
                    ? '● READY — TAP OR INSERT EMV CHIP'
                    : stage === 'scanning'
                    ? '⏳ READING MICROCHIP...'
                    : '🔐 AUTHENTICATING LEDGER...'}
                </span>
              </div>
            </div>

            {/* 2. Merchant Store Presets Selection */}
            <div>
              <label className="text-xs font-bold text-ink-muted uppercase tracking-wider block mb-2 font-mono">
                Select Shopping Mall Merchant Preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MALL_MERCHANT_PRESETS.map((m) => {
                  const isSelected = !isCustomMerchant && selectedMerchant.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setIsCustomMerchant(false);
                        setSelectedMerchant(m);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-gold/15 border-gold shadow-gold-glow scale-[1.01]'
                          : 'bg-background/60 border-glass-border hover:border-gold/30 hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-ink leading-tight">{m.name.split('—')[0]}</div>
                          <div className="text-[10px] text-ink-muted font-mono">{m.category}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold">${m.amountUSD}</span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Merchant Option Toggle */}
              <div className="mt-2.5 flex items-center justify-between text-xs px-1">
                <button
                  type="button"
                  onClick={() => setIsCustomMerchant(!isCustomMerchant)}
                  className="text-gold hover:underline font-semibold font-mono flex items-center gap-1"
                >
                  {isCustomMerchant ? '← Use Shopping Mall Presets' : '+ Custom Amount & Store Name'}
                </button>
                <span className="text-ink-muted font-mono text-[11px]">
                  Applied Server Fee: <strong className="text-gold">${expectedFee.toFixed(2)} USD</strong>
                </span>
              </div>
            </div>

            {/* Custom Input Fields if Toggled */}
            {isCustomMerchant && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-background/60 border border-glass-border">
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Store / Merchant Name</label>
                  <input
                    type="text"
                    value={customMerchantName}
                    onChange={(e) => setCustomMerchantName(e.target.value)}
                    className="w-full bg-background border border-glass-border rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Purchase Amount ($ USD)</label>
                  <input
                    type="number"
                    step="5"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-background border border-glass-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            {/* Card Selection Selector */}
            {cards.length > 1 && (
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Select Active Payment Card</label>
                <select
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-xs font-mono text-ink focus:outline-none focus:border-gold"
                >
                  {cards.map((c) => (
                    <option key={c.id} value={c.id} className="bg-background text-ink">
                      {c.cardType} — {c.maskedPan} ({c.cardholderName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 3. Interactive Contactless EMV Chip Payment Action Button */}
            <div className="pt-2">
              <button
                onClick={handleStartChipPayment}
                disabled={stage !== 'idle'}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold via-yellow-500 to-gold hover:opacity-90 font-bold text-sm text-background shadow-gold-glow transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50"
              >
                {stage === 'idle' ? (
                  <>
                    <div className="h-8 w-8 rounded-lg bg-background/20 flex items-center justify-center text-background">
                      <Zap className="h-5 w-5 animate-pulse" />
                    </div>
                    <span className="font-display tracking-wide">TAP CHIP & PAY AT POS TERMINAL</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <div className="flex items-center gap-2 font-mono">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>{stageMessage}</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ================= 4. AUTHENTIC POS PRINTED THERMAL RECEIPT VIEW ================= */
          <div className="space-y-5 animate-in fade-in zoom-in-95">
            {/* Printed Thermal Receipt Container */}
            <div className="bg-[#FAF8F5] text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-300 font-mono text-xs relative overflow-hidden">
              {/* Receipt Tear-Off Top Zig-Zag Graphic */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-slate-200 to-transparent" />

              {/* Receipt Header */}
              <div className="text-center border-b border-dashed border-slate-400 pb-4 space-y-1">
                <div className="font-black text-base tracking-widest uppercase">NOVABANK POS PAY</div>
                <div className="font-bold text-xs text-slate-700">{currentMerchantName}</div>
                <div className="text-[10px] text-slate-500">Shopping Mall Terminal ID: NVB-POS-8921</div>
                <div className="text-[10px] text-slate-500">{new Date().toLocaleString()}</div>
              </div>

              {/* Status Banner */}
              <div className="my-4 p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-center font-bold">
                <div className="flex items-center justify-center gap-1.5 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>PAYMENT AUTHORIZED & APPROVED ✓</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                  EMV Chip Signature Validated — Ledger Settled
                </div>
              </div>

              {/* Receipt Line Items Breakdown */}
              <div className="space-y-2 py-2 border-b border-dashed border-slate-400 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Store Purchase:</span>
                  <span className="font-bold">${result?.amountUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Interchange Network Fee:</span>
                  <span className="font-bold">${result?.feeAppliedUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                  <span>TOTAL DEBITED:</span>
                  <span className="text-slate-900">${result?.totalDebitedUSD.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Card & Ref Meta Details */}
              <div className="pt-3 space-y-1 text-[10px] text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span>Card PAN:</span>
                  <span className="font-bold text-slate-800">4111 •••• •••• 9821</span>
                </div>
                <div className="flex justify-between">
                  <span>MCC Category:</span>
                  <span className="font-bold text-slate-800">{isCustomMerchant ? '5999' : selectedMerchant.mcc}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Ref ID:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">
                    {result?.transactionId || 'AUTH-9821098'}
                  </span>
                </div>
              </div>

              {/* Bottom Receipt Barcode Graphic */}
              <div className="mt-5 pt-3 border-t border-dashed border-slate-400 text-center">
                <div className="h-8 bg-[#111] mx-auto rounded flex items-center justify-center opacity-85">
                  <span className="text-[9px] text-white tracking-[0.4em] font-mono select-none">
                    ||||| ||| ||||||| |||| |||||| ||| ||||
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-1">
                  Thank You For Shopping With NovaBank
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl bg-surface hover:bg-surface-hover text-ink border border-glass-border text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4 text-gold" />
                <span>Process Another Charge</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
              >
                Done / Close Terminal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
