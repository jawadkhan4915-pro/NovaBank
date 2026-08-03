import React from 'react';
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Landmark,
  ShoppingBag,
  Settings,
  HelpCircle,
  FileText,
  MessageSquare,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAuth }) => {
  return (
    <footer className="relative z-10 w-full bg-background border-t border-glass-border pt-12 pb-8 px-4 lg:px-8 mt-16 text-ink-muted">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-gold via-violet to-gold p-[2px]">
                <div className="h-full w-full bg-background rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-gold">N</span>
                </div>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-ink">
                NovaBank
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-ink-muted">
              Next-generation institutional banking engine combining multi-currency fiat reserves, 50% LTV crypto loans, instant virtual Visa/Mastercard cards, and 15-second locked OTC quotes.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-glass-border text-xs font-mono font-semibold text-gold">
                <Lock className="h-3 w-3" /> AES-256 Multi-Sig
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-glass-border text-xs font-mono font-semibold text-success">
                <ShieldCheck className="h-3 w-3" /> SOC2 Audited
              </span>
            </div>
          </div>

          {/* Products & Features Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono">Products</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('cards')} className="hover:text-gold transition-colors flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-gold" /> Payment Cards
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('loans')} className="hover:text-violet transition-colors flex items-center gap-1">
                  <Landmark className="h-3.5 w-3.5 text-violet" /> Crypto Loans (50% LTV)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-gold transition-colors flex items-center gap-1">
                  <ShoppingBag className="h-3.5 w-3.5 text-gold" /> Crypto Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-ink transition-colors flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-success" /> Double-Entry Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Account Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono">Support & Help</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('support')} className="hover:text-gold transition-colors flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-gold" /> Concierge Desk 24/7
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('support')} className="hover:text-danger transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-danger" /> Security Emergency Freeze
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('faqs')} className="hover:text-ink transition-colors flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5 text-violet" /> Knowledge Base & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('settings')} className="hover:text-gold transition-colors flex items-center gap-1">
                  <Settings className="h-3.5 w-3.5 text-gold" /> Profile & 2FA Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-gold transition-colors flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-gold" /> Terms of Service (§1.0)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-violet transition-colors flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-violet" /> Privacy Policy (§2.0)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-success transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" /> AML & Sanctions Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-gold transition-colors flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-gold" /> Fee Schedule & Interchange
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-ink font-semibold">Ledger Real-Time Reconciled • All Systems Operational</span>
          </div>

          <div className="font-mono text-ink-faint">
            © 2026 NovaBank Financial Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
