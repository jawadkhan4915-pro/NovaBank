import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Tag } from 'lucide-react';
import { Product, CryptoCurrency } from '@novabank/shared';
import { api } from '../../lib/api';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<string, number>;
  onSuccess: () => void;
}

export const MarketplaceModal: React.FC<MarketplaceModalProps> = ({ isOpen, onClose, balances, onSuccess }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paidCurrency, setPaidCurrency] = useState<CryptoCurrency>('SOL');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get('/marketplace/products').then((res) => {
        if (res.data.success) {
          setProducts(res.data.data);
          if (res.data.data.length > 0) setSelectedProduct(res.data.data[0]);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockRates: Record<CryptoCurrency, number> = { BTC: 65000, ETH: 3500, BNB: 580, SOL: 145, BCH: 450 };
  const rate = mockRates[paidCurrency] || 1;
  const priceUSD = selectedProduct?.priceUSD || 0;
  const reqCrypto = Math.round((priceUSD / rate) * 100000) / 100000;
  const userBalance = balances[paidCurrency] || 0;

  const handleCheckout = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      setMsg('');
      const res = await api.post('/marketplace/checkout', {
        productId: selectedProduct.id || (selectedProduct as any)._id,
        paidCurrency,
      });

      if (res.data.success) {
        setMsg(`Order Confirmed! Purchased "${selectedProduct.title}" with ${reqCrypto} ${paidCurrency}.`);
        onSuccess();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-card rounded-2xl border border-white/20 p-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">NovaBank Crypto Marketplace</h3>
            <p className="text-xs text-slate-400">Checkout luxury hardware & digital assets directly with BTC, ETH, SOL, BNB, BCH</p>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {products.map((p) => {
            const isSelected = (selectedProduct?.id || (selectedProduct as any)?._id) === (p.id || (p as any)._id);
            return (
              <div
                key={p.id || (p as any)._id}
                onClick={() => setSelectedProduct(p)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex gap-3 ${
                  isSelected
                    ? 'bg-aurora-violet/20 border-aurora-violet shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <img src={p.imageUrl} alt={p.title} className="h-16 w-16 object-cover rounded-lg bg-black/40" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white leading-snug line-clamp-1">{p.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-aurora-cyan/20 text-aurora-cyan font-bold">
                      ${p.priceUSD}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Summary */}
        {selectedProduct && (
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Pay with Crypto Asset</span>
              <div className="flex items-center gap-2">
                <select
                  value={paidCurrency}
                  onChange={(e) => setPaidCurrency(e.target.value as CryptoCurrency)}
                  className="bg-white/10 border border-white/10 text-white text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  {['BTC', 'ETH', 'BNB', 'SOL', 'BCH'].map((c) => (
                    <option key={c} value={c} className="bg-[#0A0A0F] text-white">{c}</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400">Balance: {userBalance} {paidCurrency}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-white/10 pt-2">
              <span className="text-xs text-slate-400">Checkout Price</span>
              <div className="text-right">
                <div className="text-lg font-black text-emerald-400">{reqCrypto} {paidCurrency}</div>
                <div className="text-[10px] text-slate-400">(${selectedProduct.priceUSD} USD equivalent)</div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || userBalance < reqCrypto}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-emerald font-bold text-sm text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? 'Processing Checkout...' : userBalance < reqCrypto ? `Insufficient ${paidCurrency} Balance` : `Confirm Order for ${reqCrypto} ${paidCurrency}`}
            </button>
          </div>
        )}

        {msg && <p className="text-xs text-center font-semibold text-emerald-400 mt-3">{msg}</p>}
      </div>
    </div>
  );
};
