import React, { useState } from 'react';
import { X, Gift, Copy, Check, Users, Sparkles, DollarSign, ArrowRight, Share2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const refCode = user?.referralCode || user?.bankIdNumber || 'REF-894270';
  const referralLink = `${window.location.origin}/?ref=${refCode}`;
  const totalEarnedUSD = user?.referralEarningsUSD || 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-hero rounded-3xl border border-gold/30 p-6 shadow-2xl relative overflow-hidden text-ink">
        {/* Glow Background Accent */}
        <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-violet/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-surface hover:bg-surface-hover text-ink-muted hover:text-ink border border-glass-border transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-gold via-violet to-gold p-[2px] mb-3">
            <div className="h-full w-full bg-background rounded-[14px] flex items-center justify-center">
              <Gift className="h-6 w-6 text-gold animate-bounce" />
            </div>
          </div>
          <h2 className="text-xl font-display font-bold tracking-tight">
            Invite Friends & Earn $2 Gift
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            Get $2.00 USD credited directly to your USD wallet for every friend who joins & verifies KYC.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-surface border border-glass-border text-center space-y-0.5">
            <div className="text-xs text-ink-muted flex items-center justify-center gap-1">
              <Gift className="h-3.5 w-3.5 text-gold" /> Reward Per Friend
            </div>
            <div className="text-lg font-mono font-bold text-gold">$2.00 USD</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-glass-border text-center space-y-0.5">
            <div className="text-xs text-ink-muted flex items-center justify-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-success" /> Total Earned
            </div>
            <div className="text-lg font-mono font-bold text-success">${totalEarnedUSD.toFixed(2)} USD</div>
          </div>
        </div>

        {/* Referral Link Box */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block">
            Your Unique Referral Link
          </label>
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-background border border-gold/30">
            <span className="text-xs font-mono text-gold truncate max-w-[250px] font-semibold">
              {referralLink}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Referral Program How it Works */}
        <div className="p-4 rounded-2xl bg-surface/60 border border-glass-border space-y-2.5 text-xs">
          <div className="font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-gold" /> How Referral Rewards Work
          </div>
          <ol className="space-y-1.5 text-ink-muted list-decimal list-inside leading-relaxed">
            <li>Copy & share your invitation link with friends or colleagues.</li>
            <li>Your friend registers their new NovaBank account.</li>
            <li>Upon successful 3-step KYC verification, **$2.00 USD** is instantly credited to your wallet balance!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
