import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Landmark,
  ArrowRight,
  Sparkles,
  Lock,
  ArrowRightLeft,
  ChevronRight,
} from 'lucide-react';
import { SpotlightCard } from '../../components/SpotlightCard';
import { TiltCard } from '../../components/TiltCard';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { LiveCryptoMarketGrid } from '../../components/LiveCryptoMarketGrid';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onLaunchApp }) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Private Ledger Financial Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-ink leading-[1.1]">
              Institutional Banking & <br />
              <span className="text-gradient-gold">Crypto Liquidity</span> Simplified.
            </h1>

            {/* Body Copy */}
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-2xl font-normal">
              Manage multi-currency fiat reserves, lock collateral for instant USD loans, issue virtual Visa & Mastercard credit cards, and swap crypto assets with guaranteed 15-second locked quotes.
            </p>

            {/* CTA Action Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchApp}
                className="px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-sm shadow-gold-glow flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Launch NovaBank Console</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-hover border border-glass-border text-ink font-semibold text-sm transition-all flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-violet" />
                <span>Open Private Account</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-glass-border">
              <div>
                <div className="text-xs text-ink-muted font-semibold">Security Model</div>
                <div className="text-xs font-bold text-ink flex items-center gap-1 mt-0.5 font-mono">
                  <Lock className="h-3.5 w-3.5 text-gold" /> AES-256 Multi-Sig
                </div>
              </div>
              <div>
                <div className="text-xs text-ink-muted font-semibold">Collateral LTV</div>
                <div className="text-xs font-bold text-ink flex items-center gap-1 mt-0.5 font-mono">
                  <Landmark className="h-3.5 w-3.5 text-violet" /> Max 50% Limit
                </div>
              </div>
              <div>
                <div className="text-xs text-ink-muted font-semibold">Quote Settlement</div>
                <div className="text-xs font-bold text-ink flex items-center gap-1 mt-0.5 font-mono">
                  <Zap className="h-3.5 w-3.5 text-success" /> 15s Rate Lock
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Floating 3D Preview Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md space-y-4">
              {/* 3D Parallax Tilt Card Component */}
              <TiltCard
                cardType="Virtual Visa"
                maskedPan="4111 •••• •••• 9821"
                cardholderName="ALEX VANCE"
                expiryMonth={12}
                expiryYear={28}
                status="ACTIVE POS"
              />

              {/* Micro Stat Cards with Animated Counter */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <SpotlightCard className="p-3.5">
                  <div className="text-xs text-ink-muted font-semibold uppercase">Total Portfolio</div>
                  <div className="text-lg font-display font-bold text-ink mt-0.5">
                    <AnimatedCounter value={48250.00} prefix="$" />
                  </div>
                </SpotlightCard>

                <SpotlightCard className="p-3.5">
                  <div className="text-xs text-ink-muted font-semibold uppercase">Active Loan LTV</div>
                  <div className="text-lg font-mono font-bold text-gold mt-0.5">
                    <AnimatedCounter value={42.5} suffix="%" decimals={1} />
                  </div>
                </SpotlightCard>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Tracking Crypto Currency Card & Grid Section */}
      <section className="max-w-7xl mx-auto">
        <LiveCryptoMarketGrid onOpenConvert={onLaunchApp} />
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
          <SpotlightCard spotlightColor="rgba(201, 162, 92, 0.15)" className="p-6">
            <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center mb-4">
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
          </SpotlightCard>

          {/* Feature 2 */}
          <SpotlightCard spotlightColor="rgba(108, 92, 231, 0.15)" className="p-6">
            <div className="h-12 w-12 rounded-xl bg-violet/15 text-violet border border-violet/30 flex items-center justify-center mb-4">
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
              Apply for Loan <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </SpotlightCard>

          {/* Feature 3 */}
          <SpotlightCard spotlightColor="rgba(201, 162, 92, 0.15)" className="p-6">
            <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center mb-4">
              <ArrowRightLeft className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Instant OTC Conversions</h3>
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              Convert crypto assets directly to USD fiat with guaranteed 15-second locked quotes, zero hidden slippage, and immediate double-entry ledger settlement.
            </p>
            <button
              onClick={onLaunchApp}
              className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
            >
              Convert Crypto Now <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </SpotlightCard>
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
