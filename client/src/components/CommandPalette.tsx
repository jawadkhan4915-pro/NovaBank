import React, { useEffect, useState } from 'react';
import { Search, CreditCard, ArrowRightLeft, Landmark, ShoppingBag, ShieldCheck, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectAction }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('open_cmd');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const actions = [
    { id: 'deposit', label: 'Deposit Crypto (BTC, ETH, SOL, BNB, BCH)', icon: ArrowRightLeft, cat: 'Finance' },
    { id: 'convert', label: 'Convert Crypto to USD (15s Locked Quote)', icon: ArrowRightLeft, cat: 'Finance' },
    { id: 'issue_card', label: 'Issue Virtual Card Instantly', icon: CreditCard, cat: 'Cards' },
    { id: 'test_card', label: 'Test Card Charge POS Simulator', icon: CreditCard, cat: 'Cards' },
    { id: 'apply_loan', label: 'Take Crypto-Collateralized Loan (50% LTV)', icon: Landmark, cat: 'Loans' },
    { id: 'marketplace', label: 'Shop Multi-Crypto Marketplace', icon: ShoppingBag, cat: 'Marketplace' },
    { id: 'kyc', label: 'Complete KYC Verification', icon: ShieldCheck, cat: 'Account' },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) || a.cat.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-xl glass-card rounded-2xl border border-glass-border overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-glass-border flex items-center gap-3">
          <Search className="h-5 w-5 text-gold" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-ink focus:outline-none placeholder:text-ink-faint text-sm"
          />
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-ink-faint">No matching commands found</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectAction(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gold/15 text-gold group-hover:bg-gold group-hover:text-background transition-all">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ink">{item.label}</div>
                      <div className="text-xs text-ink-faint">{item.cat}</div>
                    </div>
                  </div>
                  <span className="text-xs text-ink-muted font-mono">↵ Select</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
