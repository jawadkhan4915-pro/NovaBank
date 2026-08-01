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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-aurora-cyan">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span>NovaBank Architecture 2026</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Next-Gen <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-emerald">
                Crypto-Fiat Banking
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Bridge your digital wealth with real-world liquidity. Issue instant virtual Visa/Mastercard debit cards, access 50% LTV crypto-backed USD loans, and manage multi-currency ledgers seamlessly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center md:justify-start">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-emerald hover:opacity-95 font-bold text-xs sm:text-sm text-white shadow-aurora-glow transition-all flex items-center gap-2 group"
              >
                <span>Open Nova Account</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLaunchApp}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 font-bold text-xs sm:text-sm text-white transition-all flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Launch Interactive App</span>
              </button>
            </div>

            {/* Feature Checklist Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Instant Card Issuance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>0 Credit Check Loans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Double-Entry Ledger</span>
              </div>
            </div>
          </div>

          {/* Right Floating 3D Preview Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-aurora-cyan/30 to-aurora-violet/30 rounded-3xl blur-2xl transform rotate-3 scale-95" />

              {/* Main Card Mockup */}
              <div className="relative glass-card rounded-3xl p-6 border border-white/20 shadow-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-aurora-cyan/20 border border-aurora-cyan/30 flex items-center justify-center font-bold text-aurora-cyan text-sm">
                      N
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">NovaBank Card</div>
                      <div className="text-[10px] text-slate-400">Virtual Visa Premium</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Active POS
                  </span>
                </div>

                {/* Virtual Card Graphic */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-white/20 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-violet">
                      NOVABANK
                    </span>
                    <Zap className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="font-mono text-base tracking-widest text-white font-bold my-2">
                    4111 •••• •••• 9821
                  </div>
                  <div className="flex justify-between items-end text-[10px] text-slate-300">
                    <div>
                      <div className="text-slate-500 uppercase text-[8px]">Cardholder</div>
                      <div className="font-bold">ALEX VANCE</div>
                    </div>
                    <div>
                      <div className="text-slate-500 uppercase text-[8px]">Expires</div>
                      <div className="font-bold">12/28</div>
                    </div>
                  </div>
                </div>

                {/* Micro Stat */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Portfolio</div>
                    <div className="text-base font-black text-white">$48,250.00</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Loan LTV</div>
                    <div className="text-base font-black text-aurora-cyan">42.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Ticker Bar */}
      <section className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-4 border border-white/15 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-aurora-cyan" /> Supported Assets & Real-Time Rates
            </span>
            <span className="text-[10px] text-slate-400 font-mono">15s Live Feed</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(mockRates).map(([symbol, item]) => (
              <div key={symbol} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>{symbol}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{item.change}</span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1">${item.rate.toLocaleString()} USD</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Feature Pillars */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Integrated Financial Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered for high-volume traders, crypto-native businesses, and individuals needing instant liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card rounded-3xl p-6 border border-white/15 hover:border-aurora-cyan/40 transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-aurora-cyan/15 text-aurora-cyan border border-aurora-cyan/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Virtual & Physical Cards</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Instantly issue Visa/Mastercard virtual payment cards backed by your multi-currency balances. Set custom daily spending limits and test POS charges in real time.
            </p>
            <button
              onClick={onLaunchApp}
              className="text-xs font-bold text-aurora-cyan hover:underline flex items-center gap-1"
            >
              Explore Payment Cards <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-3xl p-6 border border-white/15 hover:border-aurora-violet/40 transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-aurora-violet/15 text-aurora-violet border border-aurora-violet/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Landmark className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Crypto-Backed Loans</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Lock BTC, ETH, SOL, BNB or BCH as collateral to borrow instant USD fiat up to 50% LTV ratio with zero credit checks and flat $1 repayment fee rules.
            </p>
            <button
              onClick={onLaunchApp}
              className="text-xs font-bold text-aurora-violet hover:underline flex items-center gap-1"
            >
              Calculate Loan Terms <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-3xl p-6 border border-white/15 hover:border-aurora-emerald/40 transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-aurora-emerald/15 text-aurora-emerald border border-aurora-emerald/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Double-Entry Ledger & Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Every deposit, conversion, card swipe, and loan repayment is immutably recorded in a strict double-entry ledger with 2FA TOTP authentication protection.
            </p>
            <button
              onClick={onLaunchApp}
              className="text-xs font-bold text-aurora-emerald hover:underline flex items-center gap-1"
            >
              View Security Protocols <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="max-w-7xl mx-auto glass-card rounded-3xl p-8 sm:p-12 border border-white/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan/10 via-aurora-violet/10 to-aurora-emerald/10 pointer-events-none" />
        <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">
          Ready to Experience Modern Crypto Banking?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Create an account in less than 30 seconds or launch interactive sandbox mode instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onOpenAuth('register')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-violet font-bold text-xs text-white hover:opacity-90 transition-all shadow-lg"
          >
            Get Started Now
          </button>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs text-white border border-white/20 transition-all"
          >
            Enter Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};
