import React, { useState } from 'react';
import { X, CreditCard, Sparkles, Truck } from 'lucide-react';
import { CardType } from '@novabank/shared';
import { api } from '../../lib/api';

interface IssueCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const IssueCardModal: React.FC<IssueCardModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [cardType, setCardType] = useState<CardType>('VIRTUAL');
  const [cardholderName, setCardholderName] = useState('Alex Vance');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleIssue = async () => {
    try {
      setLoading(true);
      setMsg('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md glass-card rounded-2xl border border-white/20 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Issue NovaBank Card</h3>
            <p className="text-xs text-slate-400">Virtual instant setup or physical metal card delivery</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          {/* Card Type Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCardType('VIRTUAL')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                cardType === 'VIRTUAL'
                  ? 'bg-aurora-violet/20 border-aurora-violet text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4 text-aurora-cyan mb-1.5" />
              <div className="font-bold text-xs">Virtual Card</div>
              <div className="text-[10px] text-slate-400">Instant activation & online use</div>
            </button>

            <button
              onClick={() => setCardType('PHYSICAL')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                cardType === 'PHYSICAL'
                  ? 'bg-aurora-violet/20 border-aurora-violet text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="h-4 w-4 text-aurora-emerald mb-1.5" />
              <div className="font-bold text-xs">Physical Card</div>
              <div className="text-[10px] text-slate-400">Laser-engraved black metal card</div>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Cardholder Full Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-aurora-cyan"
            />
          </div>

          {cardType === 'PHYSICAL' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Shipping Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Full delivery street address, city, country"
                rows={2}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurora-cyan"
              />
            </div>
          )}

          <button
            onClick={handleIssue}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-emerald font-bold text-sm text-white hover:opacity-90 transition-all shadow-lg"
          >
            {loading ? 'Processing Issuance...' : `Issue ${cardType} Card Now`}
          </button>
        </div>

        {msg && <p className="text-xs text-center font-semibold text-emerald-400">{msg}</p>}
      </div>
    </div>
  );
};
