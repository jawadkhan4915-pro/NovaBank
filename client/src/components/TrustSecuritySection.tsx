import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Landmark,
  CheckCircle2,
  Award,
  BadgeCheck,
  Globe,
  Users,
  Server,
  FileText,
  KeyRound,
  Eye,
  Scale,
  Star,
  Building2,
  Sparkles,
  Clock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { AnimatedCounter } from './AnimatedCounter';

export const TrustSecuritySection: React.FC<{ onLaunchApp: () => void }> = ({ onLaunchApp }) => {
  const [activeTab, setActiveTab] = useState<'custody' | 'por' | 'regulatory' | 'insurance'>('custody');

  const securityFeatures = [
    {
      id: 'custody',
      title: 'Multi-Sig Cold Vault Storage',
      subtitle: '98% Offline Institutional Hardware Custody',
      icon: Lock,
      color: 'gold',
      badge: 'AES-256 Multi-Sig',
      description:
        'The vast majority of customer fiat and digital assets are kept offline in air-gapped, multi-signature hardware security modules (HSM). Access requires 3-of-5 threshold cryptographic consensus key shares managed by Fireblocks and BitGo institutional infrastructure.',
      bullets: [
        '98% of customer assets held strictly in cold storage vaults',
        'Multi-Party Computation (MPC) threshold signatures',
        'Geographically distributed vault vaults in Zurich & New York',
        'Biometric hardware security key (FIDO2 / YubiKey) enforcement',
      ],
    },
    {
      id: 'por',
      title: 'Real-Time Proof of Reserves (PoR)',
      subtitle: 'Cryptographic 1:1 Solvency Verification',
      icon: Eye,
      color: 'violet',
      badge: '100% 1:1 Backed',
      description:
        'NovaBank operates on a strict non-fractional reserve model. Customer deposits are never re-hypothecated, lent without collateral, or risked. Every dollar and token is cryptographically accountable on our immutable Merkle-tree double-entry ledger.',
      bullets: [
        'Live 60-second Merkle-tree solvency verification engine',
        'Zero fractional-reserve lending of customer funds',
        'Independent quarterly audits by Big-Four accounting firms',
        'Public cryptographic hash verification tools for every account',
      ],
    },
    {
      id: 'regulatory',
      title: 'Global Regulatory & Legal Licensing',
      subtitle: 'FinCEN MSB Registered & SOC 2 Type II Certified',
      icon: Scale,
      color: 'gold',
      badge: 'MSB #3100028491',
      description:
        'NovaBank Financial Corp is fully registered as a Money Services Business (MSB) with the U.S. Department of the Treasury (FinCEN) and maintains SOC 2 Type II and ISO/IEC 27001 information security accreditations.',
      bullets: [
        'FinCEN Registered MSB (Registration ID: #3100028491)',
        'Full compliance with Bank Secrecy Act (BSA) & FATF Travel Rule',
        'Automated real-time Chainalysis KYT transaction monitoring',
        'Tier-3 Liveness Face Verification & CNIC biometric checks',
      ],
    },
    {
      id: 'insurance',
      title: 'FDIC & $100M+ Custodial Insurance',
      subtitle: 'Pass-Through Deposit & Digital Asset Coverage',
      icon: ShieldCheck,
      color: 'emerald',
      badge: '$100M Crime Policy',
      description:
        'Your fiat USD balances benefit from FDIC pass-through deposit insurance up to $250,000 through our partner bank accounts. Digital assets are insured against theft, breach, or cyber risk via a $100M crime insurance policy underwritten by Lloyd\'s of London.',
      bullets: [
        'FDIC pass-through protection up to $250,000 for USD accounts',
        '$100,000,000 Lloyd\'s of London digital asset crime policy',
        'Instant 24/7 Security Emergency Freeze control in user app',
        'Zero-liability protection on unauthorized payment card charges',
      ],
    },
  ];

  const trustMetrics = [
    {
      label: 'Assets Under Custody',
      value: 2450000000,
      prefix: '$',
      suffix: '+',
      formatted: '$2.45 Billion+',
      subtext: '100% 1:1 Backed Reserves',
      icon: Building2,
      color: 'text-gold',
    },
    {
      label: 'Active Verified Accounts',
      value: 150000,
      suffix: '+',
      formatted: '150,000+',
      subtext: 'Across 140+ Countries',
      icon: Users,
      color: 'text-violet',
    },
    {
      label: 'Settlement Volume',
      value: 12800000000,
      prefix: '$',
      suffix: '+',
      formatted: '$12.8 Billion+',
      subtext: 'Reconciled Double-Entry Ledger',
      icon: Server,
      color: 'text-gold',
    },
    {
      label: 'Uptime & SLA Guarantee',
      value: 99.99,
      suffix: '%',
      formatted: '99.99%',
      subtext: 'High-Availability Banking Infrastructure',
      icon: Clock,
      color: 'text-success',
    },
  ];

  const accreditations = [
    { name: 'FinCEN MSB Registered', icon: BadgeCheck, text: 'Reg ID: 3100028491' },
    { name: 'FDIC Pass-Through Insured', icon: ShieldCheck, text: 'Up to $250,000 USD' },
    { name: 'SOC 2 Type II Certified', icon: Award, text: 'AICPA Security Standards' },
    { name: 'ISO/IEC 27001 Certified', icon: FileText, text: 'Information Security Management' },
    { name: 'Visa & Mastercard Partner', icon: Landmark, text: 'Direct Network Card Issuance' },
    { name: 'BitGo & Fireblocks Custody', icon: KeyRound, text: 'Institutional Vault Infra' },
  ];

  const customerReviews = [
    {
      name: 'Marcus Vance',
      role: 'Managing Partner, Apex Capital',
      text: 'NovaBank is the only bank where I can manage multi-currency fiat reserves and borrow against our BTC holding at 50% LTV with total transparent 1:1 Merkle solvency proof.',
      rating: 5,
      verified: 'Verified Institutional Client',
    },
    {
      name: 'Elena Rostova',
      role: 'Crypto Founder & Angel Investor',
      text: 'The 15-second locked OTC converter combined with virtual Visa card issuance has saved our startup tens of thousands in transaction fees. Ultra-secure and authentic.',
      rating: 5,
      verified: 'Verified Business Account',
    },
    {
      name: 'David K. Miller',
      role: 'Senior Software Architect',
      text: 'The level of security detail—AES-256 multi-sig, SOC2 compliance, and instant 24/7 security freeze—makes NovaBank feel far more reliable than traditional legacy banks.',
      rating: 5,
      verified: 'Verified Account Holder',
    },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* 1. Key Trust & Metric Counter Grid */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Institutional-Grade Financial Trust</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
            Backed by Proven Solvency & Global Trust
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            NovaBank combines traditional banking security standards with cutting-edge cryptographic solvency proofs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <SpotlightCard key={idx} spotlightColor="rgba(201, 162, 92, 0.12)" className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-ink-muted uppercase">{m.label}</span>
                  <div className={`p-2 rounded-xl bg-surface border border-glass-border ${m.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
                  {m.formatted}
                </div>
                <div className="text-xs font-mono font-medium text-gold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  {m.subtext}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* 2. Regulatory & Security Accreditations Ribbon */}
      <section className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-6 border border-glass-border">
          <div className="text-center mb-6">
            <h3 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
              Institutional Compliance & Security Accreditations
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {accreditations.map((acc, idx) => {
              const Icon = acc.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-background/60 border border-glass-border hover:border-gold/30 transition-all hover:scale-[1.02]"
                >
                  <Icon className="h-6 w-6 text-gold mb-2" />
                  <span className="text-xs font-bold text-ink leading-tight">{acc.name}</span>
                  <span className="text-[10px] font-mono text-ink-muted mt-1">{acc.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Deep Dive: Why NovaBank is 100% Authentic & Secure (Interactive Tabbed Viewer) */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/10 border border-violet/30 text-violet text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Uncompromising Security Framework</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
            Why NovaBank is 100% Authentic & Trusted 🔐
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Explore our multi-layered defense architecture, cryptographic proof of solvency, and tier-1 banking regulatory licenses.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 bg-background/60 p-1.5 rounded-2xl border border-glass-border max-w-3xl mx-auto">
          {securityFeatures.map((feat) => {
            const Icon = feat.icon;
            const isSelected = activeTab === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gold text-background shadow-gold-glow scale-[1.02]'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-background' : 'text-gold'}`} />
                <span>{feat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Detail View */}
        {securityFeatures
          .filter((f) => f.id === activeTab)
          .map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SpotlightCard
                  spotlightColor={feat.color === 'violet' ? 'rgba(108, 92, 231, 0.18)' : 'rgba(201, 162, 92, 0.18)'}
                  className="p-8 border-gold/30"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Details */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-gold/15 border border-gold/30 text-gold">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold text-gold uppercase px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                            {feat.badge}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-display font-bold text-ink mt-1">
                            {feat.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                        {feat.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {feat.bullets.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs font-medium text-ink">
                            <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex items-center gap-4">
                        <button
                          onClick={onLaunchApp}
                          className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all"
                        >
                          Explore Console & Security Features
                        </button>
                        <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-success" /> Live Status: 100% Operational
                        </span>
                      </div>
                    </div>

                    {/* Right Visual Card */}
                    <div className="lg:col-span-5">
                      <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 border border-glass-border space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-glass-border pb-3">
                          <span className="text-xs font-mono font-bold text-ink uppercase flex items-center gap-1.5">
                            <BadgeCheck className="h-4 w-4 text-gold" /> Authenticity Protocol
                          </span>
                          <span className="text-[10px] font-mono text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/30 font-bold">
                            VERIFIED ACTIVE
                          </span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between items-center bg-background/60 p-2.5 rounded-xl border border-glass-border font-mono">
                            <span className="text-ink-muted">Custody Vault ID:</span>
                            <span className="text-gold font-bold">ZRH-VAULT-0982</span>
                          </div>
                          <div className="flex justify-between items-center bg-background/60 p-2.5 rounded-xl border border-glass-border font-mono">
                            <span className="text-ink-muted">Reserve Backing Ratio:</span>
                            <span className="text-success font-bold">1:1 (100.00%)</span>
                          </div>
                          <div className="flex justify-between items-center bg-background/60 p-2.5 rounded-xl border border-glass-border font-mono">
                            <span className="text-ink-muted">FinCEN MSB Registration:</span>
                            <span className="text-ink font-bold">#3100028491</span>
                          </div>
                          <div className="flex justify-between items-center bg-background/60 p-2.5 rounded-xl border border-glass-border font-mono">
                            <span className="text-ink-muted">FDIC Partner Coverage:</span>
                            <span className="text-violet font-bold">$250,000 USD / Account</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gold/10 border border-gold/25 text-center">
                          <p className="text-[11px] font-mono text-gold font-medium">
                            🔒 Double-Entry Ledger Reconciled Live Every 60 Seconds
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
      </section>

      {/* 4. Client Ratings & Verified Testimonials Carousel/Grid */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-glass-border pb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-ink">
              Trusted by 150,000+ Institutional & Retail Clients
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Read authentic experiences from high-net-worth investors, traders, and founders.
            </p>
          </div>

          {/* Trustpilot Score Badge */}
          <div className="flex items-center gap-3 bg-surface px-4 py-2.5 rounded-2xl border border-glass-border">
            <div className="flex items-center text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-ink">4.9 / 5.0 Rating</div>
              <div className="text-[10px] text-ink-muted font-mono">12,500+ Verified Trustpilot Reviews</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev, idx) => (
            <SpotlightCard key={idx} spotlightColor="rgba(201, 162, 92, 0.1)" className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-success font-bold bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                  {rev.verified}
                </span>
              </div>
              <p className="text-xs text-ink leading-relaxed italic mb-4">"{rev.text}"</p>
              <div className="border-t border-glass-border pt-3">
                <div className="text-xs font-bold text-ink">{rev.name}</div>
                <div className="text-[10px] text-ink-muted font-mono">{rev.role}</div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 5. Official Headquarters & Bank Identification Card */}
      <section className="max-w-7xl mx-auto">
        <SpotlightCard spotlightColor="rgba(108, 92, 231, 0.15)" className="p-8 border-violet/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/10 border border-violet/30 text-violet text-xs font-semibold">
                <Building2 className="h-3.5 w-3.5" />
                <span>Official Global Bank Registration & Entity Details</span>
              </div>

              <h3 className="text-2xl font-display font-bold text-ink">
                NovaBank Financial Corporation
              </h3>

              <p className="text-xs text-ink-muted leading-relaxed">
                Operating under registered banking licenses and institutional custody partnerships across Switzerland, the United States, and the United Kingdom.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-background/60 border border-glass-border">
                  <div className="text-ink-muted text-[10px] font-semibold uppercase">European HQ</div>
                  <div className="text-ink font-bold mt-0.5">Zurich, Switzerland</div>
                  <div className="text-[10px] text-gold mt-0.5">CHE-482.910.119 HRB</div>
                </div>

                <div className="p-3 rounded-xl bg-background/60 border border-glass-border">
                  <div className="text-ink-muted text-[10px] font-semibold uppercase">Americas HQ</div>
                  <div className="text-ink font-bold mt-0.5">Wall St, New York, USA</div>
                  <div className="text-[10px] text-gold mt-0.5">FinCEN MSB #3100028491</div>
                </div>

                <div className="p-3 rounded-xl bg-background/60 border border-glass-border">
                  <div className="text-ink-muted text-[10px] font-semibold uppercase">SWIFT / BIC Identifier</div>
                  <div className="text-gold font-bold mt-0.5">NOVABUSZ</div>
                  <div className="text-[10px] text-success mt-0.5">Direct FedWire & SEPA</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-glass-border text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink">Need Immediate Verification?</h4>
                <p className="text-xs text-ink-muted mt-1">
                  Our compliance team provides 24/7 official audit certificates and proof of reserves for institutional clients.
                </p>
              </div>
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all"
              >
                Access Compliance Center
              </button>
            </div>
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
};
