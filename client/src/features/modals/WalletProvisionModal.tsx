import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Smartphone,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  CreditCard,
  Check,
  Radio,
  Building2,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { CardDetails } from '@novabank/shared';

interface WalletProvisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardType?: string;
  maskedPan?: string;
  cardholderName?: string;
}

export const WalletProvisionModal: React.FC<WalletProvisionModalProps> = ({
  isOpen,
  onClose,
  cardType = 'Virtual Visa',
  maskedPan = '4111 8920 4821 9821',
  cardholderName = 'ALEX VANCE',
}) => {
  const [activeTab, setActiveTab] = useState<'apple_pay' | 'google_pay' | 'physical_metal'>('apple_pay');
  const [provisioningState, setProvisioningState] = useState<'idle' | 'tokenizing' | 'success'>('idle');
  const [dpanToken, setDpanToken] = useState<string>('');

  if (!isOpen) return null;

  const handleStartTokenization = () => {
    setProvisioningState('tokenizing');

    setTimeout(() => {
      const generatedDpan = `4111 88${Math.floor(10 + Math.random() * 89)} ${Math.floor(1000 + Math.random() * 8999)} ${maskedPan.slice(-4)}`;
      setDpanToken(generatedDpan);
      setProvisioningState('success');
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-hero rounded-3xl border border-gold/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-violet/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-muted hover:text-ink transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gold/15 text-gold border border-gold/30 shadow-gold-glow">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-xl text-ink">Physical Store & Mall POS Pay</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">
                NFC TOKEN ACTIVE
              </span>
            </div>
            <p className="text-xs text-ink-muted">Enable your NovaBank Virtual Card for real-world shopping mall POS readers</p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-background/60 p-1 rounded-2xl border border-glass-border mb-6">
          <button
            onClick={() => {
              setActiveTab('apple_pay');
              setProvisioningState('idle');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'apple_pay'
                ? 'bg-gold text-background shadow-gold-glow'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Apple Pay</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('google_pay');
              setProvisioningState('idle');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'google_pay'
                ? 'bg-violet text-white shadow-violet-glow'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Google Pay</span>
          </button>

          <button
            onClick={() => setActiveTab('physical_metal')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'physical_metal'
                ? 'bg-surface border border-glass-border text-ink'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Truck className="h-4 w-4 text-gold" />
            <span>Order Metal Card</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab !== 'physical_metal' ? (
          <div className="space-y-5">
            {/* Card Information Banner */}
            <div className="p-4 rounded-2xl bg-background/70 border border-glass-border space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-glass-border pb-2">
                <span className="text-ink-muted">Cardholder:</span>
                <span className="font-bold text-ink">{cardholderName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-glass-border pb-2">
                <span className="text-ink-muted">Virtual Card PAN:</span>
                <span className="font-bold text-gold">{maskedPan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-muted">NFC Contactless Protocol:</span>
                <span className="font-bold text-success flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5 animate-pulse" /> ISO/IEC 14443 Type A/B
                </span>
              </div>
            </div>

            {provisioningState === 'idle' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-xs text-ink space-y-2">
                  <div className="font-bold text-gold flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-gold" /> How Physical POS Tap to Pay Works:
                  </div>
                  <ol className="space-y-1.5 text-ink-muted list-decimal list-inside leading-relaxed text-[11px]">
                    <li>Click below to push encrypted token to your smartphone device.</li>
                    <li>Open <strong>{activeTab === 'apple_pay' ? 'Apple Wallet' : 'Google Wallet'}</strong> on your phone or smartwatch.</li>
                    <li>Hold your phone next to any shopping mall POS card reader machine.</li>
                    <li>Authenticate with Face ID / Touch ID — Payment debits your NovaBank ledger instantly!</li>
                  </ol>
                </div>

                <button
                  onClick={handleStartTokenization}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                    activeTab === 'apple_pay'
                      ? 'bg-gold hover:bg-gold-dim text-background shadow-gold-glow'
                      : 'bg-violet hover:bg-violet-dim text-white shadow-violet-glow'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Provision One-Tap {activeTab === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} Pass</span>
                </button>
              </div>
            )}

            {provisioningState === 'tokenizing' && (
              <div className="p-8 rounded-2xl bg-background/80 border border-glass-border text-center space-y-4 font-mono">
                <div className="h-12 w-12 rounded-2xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center mx-auto animate-spin">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">Generating Encrypted NFC Hardware Token...</div>
                  <div className="text-xs text-ink-muted mt-1">Visa Direct / Mastercard MDES Cryptographic Handshake</div>
                </div>
              </div>
            )}

            {provisioningState === 'success' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                <div className="p-4 rounded-2xl bg-success/15 border border-success/40 text-xs space-y-2 font-mono">
                  <div className="flex items-center gap-2 text-success font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Card Successfully Added to {activeTab === 'apple_pay' ? 'Apple Wallet' : 'Google Pay'}!</span>
                  </div>
                  <p className="text-ink-muted text-[11px] leading-relaxed">
                    Your NovaBank card is now tokenized and active for real-world physical shopping mall POS card readers.
                  </p>
                  <div className="pt-2 border-t border-success/20 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Device Account Number (DPAN):</span>
                      <span className="font-bold text-ink">{dpanToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Secure Element Enclave:</span>
                      <span className="font-bold text-success">Hardware Encrypted (ACTIVE)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all"
                >
                  Done — Ready for Physical POS Tap to Pay
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Physical Metal Card Order Form */
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-background/80 border border-gold/30 space-y-2">
              <div className="font-bold text-gold text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gold" />
                <span>Heavyweight Laser-Engraved Metal EMV Card</span>
              </div>
              <p className="text-ink-muted text-[11px] leading-relaxed">
                Order a physical 18g solid stainless metal card embedded with real contact pin EMV microchip & NFC antenna coil. Shipped via DHL Express to your door.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-background/60 border border-gold/40 text-left">
                <div className="text-gold font-bold">Obsidian Black Metal</div>
                <div className="text-[10px] text-ink-muted mt-0.5">18g Solid Steel • Matte Finish</div>
              </div>
              <div className="p-3 rounded-xl bg-background/60 border border-glass-border text-left">
                <div className="text-ink font-bold">24K Gold Foil Plated</div>
                <div className="text-[10px] text-ink-muted mt-0.5">Mirror Gloss • Vault Standard</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-success/15 border border-success/30 text-success text-center font-mono font-bold">
              ✓ Free Worldwide DHL Express Delivery Included
            </div>

            <button
              onClick={() => {
                alert('Physical Metal Card request submitted! Tracking details dispatched via email.');
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-dim font-bold text-xs text-background shadow-gold-glow transition-all flex items-center justify-center gap-2"
            >
              <Truck className="h-4 w-4" />
              <span>Confirm & Order Physical Metal EMV Card</span>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
