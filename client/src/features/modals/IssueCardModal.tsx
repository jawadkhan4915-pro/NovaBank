import React, { useState } from 'react';
import { X, CreditCard, Sparkles, Truck, ShieldAlert, AlertCircle } from 'lucide-react';
import { CardType } from '@novabank/shared';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface IssueCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenKyc?: () => void;
}

export const IssueCardModal: React.FC<IssueCardModalProps> = ({ isOpen, onClose, onSuccess, onOpenKyc }) => {
  const { user } = useAuthStore();
  const [cardType, setCardType] = useState<CardType>('VIRTUAL');
  const [cardholderName, setCardholderName] = useState(user?.fullName || 'Alex Vance');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [kycError, setKycError] = useState('');

  if (!isOpen) return null;

  const isKycVerified = user?.kycStatus === 'VERIFIED';

  const handleIssue = async () => {
    if (!isKycVerified) {
      setKycError('KYC Verification Required: Banking card issuance requires Tier-3 identity verification.');
      return;
    }

    try {
      setLoading(true);
      setMsg('');
      setKycError('');
      const res = await api.post('/cards/issue', {
        cardType,
        cardholderName,
        shippingAddress: cardType === 'PHYSICAL' ? shippingAddress : undefined,
      });

      if (res.data.success) {
        setMsg(`Success! ${cardType} Card issued successfully.`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Card issuance failed');
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
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Issue NovaBank Card</h3>
            <p className="text-xs text-ink-muted">Virtual instant setup or physical metal card delivery</p>
          </div>
        </div>

        {/* KYC Requirement Error Banner */}
        {!isKycVerified && (
          <div className="mb-4 p-3.5 rounded-xl bg-danger/15 border border-danger/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-danger font-bold">
              <ShieldAlert className="h-4 w-4" />
              <span>KYC Requirement Missing</span>
            </div>
            <p className="text-ink-muted text-[11px] leading-relaxed">
              Visa/Mastercard issuance policies require completed CNIC, SIM & 3D Face Scan verification.
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

        <div className="space-y-4 mb-5">
          {/* Card Type Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCardType('VIRTUAL')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                cardType === 'VIRTUAL'
                  ? 'bg-gold/15 border-gold text-ink shadow-gold-glow'
                  : 'bg-surface border-glass-border text-ink-muted hover:text-ink'
              }`}
            >
              <Sparkles className="h-4 w-4 text-gold mb-1.5" />
              <div className="font-bold text-xs text-ink">Virtual Card</div>
              <div className="text-xs text-ink-muted">Instant activation & online use</div>
            </button>

            <button
              onClick={() => setCardType('PHYSICAL')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                cardType === 'PHYSICAL'
                  ? 'bg-violet/15 border-violet text-ink shadow-violet-glow'
                  : 'bg-surface border-glass-border text-ink-muted hover:text-ink'
              }`}
            >
              <Truck className="h-4 w-4 text-violet mb-1.5" />
              <div className="font-bold text-xs text-ink">Physical Card</div>
              <div className="text-xs text-ink-muted">Laser-engraved black metal card</div>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">Cardholder Full Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-gold"
            />
          </div>

          {cardType === 'PHYSICAL' && (
            <div>
              <label className="text-xs font-semibold text-ink-muted block mb-1">Shipping Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Full delivery street address, city, country"
                rows={2}
                className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold"
              />
            </div>
          )}

          <button
            onClick={handleIssue}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background transition-all shadow-gold-glow"
          >
            {loading ? 'Processing Issuance...' : `Issue ${cardType} Card Now`}
          </button>
        </div>

        {msg && <p className="text-xs text-center font-mono font-semibold text-success">{msg}</p>}
      </div>
    </div>
  );
};
