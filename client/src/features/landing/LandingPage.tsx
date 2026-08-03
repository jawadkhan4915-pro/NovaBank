import React from 'react';
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Landmark,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Lock,
  ArrowRightLeft,
  ChevronRight,
  Globe2,
  CheckCircle2,
  Wallet,
} from 'lucide-react';
import { CryptoCurrency } from '@novabank/shared';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onLaunchApp }) => {
  const mockRates: Record<CryptoCurrency, { name: string; rate: number; change: string }> = {
    BTC: { name: 'Bitcoin', rate: 65000, change: '+4.2%' },
    ETH: { name: 'Ethereum', rate: 3500, change: '+5.8%' },
    BNB: { name: 'BNB Chain', rate: 580, change: '+2.1%' },
    SOL: { name: 'Solana', rate: 145, change: '+8.4%' },
    BCH: { name: 'Bitcoin Cash', rate: 450, change: '+1.9%' },
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-glass-border text-xs font-semibold text-gold">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span>NovaBank Architecture 2026</span>
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-ink leading-[1.1]">
              Next-Gen <br className="hidden sm:block" />
              <span className="text-gradient-gold">
                Crypto-Fiat Banking
              </span>
            </h1>

            <p className="text-sm sm:text-base text-ink-muted max-w-2xl leading-relaxed">
              Bridge your digital wealth with real-world liquidity. Issue instant virtual Visa/Mastercard debit cards, access 50% LTV crypto-backed USD loans, and manage multi-currency ledgers seamlessly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center md:justify-start">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs sm:text-sm text-background shadow-gold-glow transition-all flex items-center gap-2 group"
              >
                <span>Open Nova Account</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLaunchApp}
                className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-hover border border-glass-border font-bold text-xs sm:text-sm text-ink transition-all flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-gold" />
                <span>Launch Interactive App</span>
              </button>
            </div>

            {/* Feature Checklist Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-glass-border text-xs font-semibold text-ink-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Instant Card Issuance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>0 Credit Check Loans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Double-Entry Ledger</span>
              </div>
            </div>
          </div>

          {/* Right Floating 3D Preview Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-violet/20 rounded-3xl blur-2xl transform rotate-3 scale-95" />

              {/* Main Card Mockup */}
              <div className="relative glass-hero rounded-3xl p-6 border border-gold/25 shadow-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-glass-border pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center font-display font-bold text-gold text-sm">
                      N
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">NovaBank Card</div>
                      <div className="text-xs text-ink-muted">Virtual Visa Premium</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-success/20 text-success border border-success/30 text-xs font-bold">
                    Active POS
                  </span>
                </div>

                {/* Virtual Card Graphic */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B0D12] via-[#141822] to-[#1E1B4B] border border-glass-border space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs tracking-widest text-gold">
                      NOVABANK
                    </span>
                    <Zap className="h-4 w-4 text-gold" />
                  </div>
                  <div className="font-mono text-base tracking-widest text-ink font-bold my-2">
                    4111 •••• •••• 9821
                  </div>
                  <div className="flex justify-between items-end text-xs text-ink-muted">
                    <div>
                      <div className="text-ink-faint uppercase text-xs font-semibold">Cardholder</div>
                      <div className="font-bold text-ink font-mono">ALEX VANCE</div>
                    </div>
                    <div>
                      <div className="text-ink-faint uppercase text-xs font-semibold">Expires</div>
                      <div className="font-bold text-ink font-mono">12/28</div>
                    </div>
                  </div>
                </div>

                {/* Micro Stat */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface border border-glass-border">
                    <div className="text-xs text-ink-muted font-semibold uppercase">Total Portfolio</div>
                    <div className="text-base font-display font-bold text-ink">$48,250.00</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-glass-border">
                    <div className="text-xs text-ink-muted font-semibold uppercase">Active Loan LTV</div>
                    <div className="text-base font-mono font-bold text-gold">42.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Ticker Bar */}
      <section className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-4 border border-glass-border space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gold" /> Supported Assets & Real-Time Rates
            </span>
            <span className="text-xs text-ink-muted font-mono bg-surface border border-glass-border px-2.5 py-0.5 rounded-full">
              Illustrative Feed • Live 15s
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(mockRates).map(([symbol, item]) => (
              <div key={symbol} className="p-3 rounded-xl bg-surface border border-glass-border hover:bg-surface-hover transition-all">
                <div className="flex justify-between items-center text-xs font-bold text-ink">
                  <span>{symbol}</span>
                  <span className="text-xs text-success font-mono">{item.change}</span>
                </div>
                <div className="text-xs font-mono text-ink mt-1">${item.rate.toLocaleString()} USD</div>
                <div className="text-xs text-ink-faint mt-0.5">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Feature Pillars */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
            Integrated Financial Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Engineered for high-volume traders, crypto-native businesses, and individuals needing instant liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card rounded-2xl p-6 border border-glass-border hover:border-gold/40 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Virtual & Physical Cards</h3>
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              Instantly issue Visa/Mastercard virtual payment cards backed by your multi-currency balances. Set custom daily spending limits and test POS charges in real time.
            </p>
            <button
              onClick={onLaunchApp}
              className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
            >
              Explore Payment Cards <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-2xl p-6 border border-glass-border hover:border-violet/40 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-violet/15 text-violet border border-violet/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Landmark className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Crypto-Backed Loans</h3>
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              Lock BTC, ETH, SOL, BNB or BCH as collateral to borrow instant USD fiat up to 50% LTV ratio with zero credit checks and flat $1 repayment fee rules.
            </p>
            <button
              onClick={onLaunchApp}
              className="text-xs font-bold text-violet hover:underline flex items-center gap-1"
            >
              Calculate Loan Terms <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-2xl p-6 border border-glass-border hover:border-gold/40 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Double-Entry Ledger & Security</h3>
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              Every deposit, conversion, card swipe, and loan repayment is immutably recorded in a strict double-entry ledger with 2FA TOTP authentication protection.
            </p>
            <button
              onClick={onLaunchApp}
              className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
            >
              View Security Protocols <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="max-w-7xl mx-auto glass-hero rounded-3xl p-8 sm:p-12 border border-gold/25 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-violet/10 to-gold/10 pointer-events-none" />
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-ink mb-3 tracking-tight">
          Ready to Experience Modern Crypto Banking?
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto mb-6">
          Create an account in less than 30 seconds or launch interactive sandbox mode instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onOpenAuth('register')}
            className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background hover:opacity-90 transition-all shadow-gold-glow"
          >
            Get Started Now
          </button>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-hover font-bold text-xs text-ink border border-glass-border transition-all"
          >
            Enter Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};
