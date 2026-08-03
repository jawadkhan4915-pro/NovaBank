import React, { useState } from 'react';
import { FileText, ShieldCheck, Scale, Percent, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '../../components/SpotlightCard';

export const TermsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'aml' | 'fees'>('terms');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Terms & Legal Compliance
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-semibold font-mono">
              FINCRA & SOC2 Audited
            </span>
          </h1>
          <p className="text-xs text-ink-muted">Master service agreements, privacy protection disclosures, and fee schedules</p>
        </div>
      </div>

      {/* Legal Sub Navigation Tabs */}
      <div className="flex bg-surface p-1 rounded-xl border border-glass-border w-full max-w-2xl">
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'terms' ? 'bg-gold text-background shadow-gold-glow' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'privacy' ? 'bg-violet text-white shadow-violet-glow' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('aml')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'aml' ? 'bg-surface border border-glass-border text-ink' : 'text-ink-muted hover:text-ink'
          }`}
        >
          AML / KYC Disclosure
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'fees' ? 'bg-surface border border-glass-border text-ink' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Fee Schedule
        </button>
      </div>

      {/* Content Area */}
      <SpotlightCard className="p-6 md:p-8 space-y-6">
        {activeTab === 'terms' && (
          <div className="space-y-4 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <Scale className="h-5 w-5 text-gold" /> Master Banking Service Agreement (§1.0)
            </div>
            <p>
              Welcome to NovaBank. By accessing or using our double-entry ledger console, virtual card issuance, crypto-backed loan facility, or OTC exchange quotes, you agree to be bound by these Master Terms of Service.
            </p>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">1. Account Eligibility & Multi-Sig Ledger</h4>
            <p>
              Users must complete identity verification to access multi-currency vaults. All ledger debits and credits are recorded immutably in a cryptographic double-entry ledger. Account assets are safeguarded using AES-256 multi-signature cold custody protocols.
            </p>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">2. Crypto-Collateralized Loan Obligations</h4>
            <p>
              Loans issued via NovaBank carry a strict maximum 50% Loan-to-Value (LTV) limit at disbursement. Borrowers are required to maintain collateral value above the 75% LTV liquidation threshold. Flat $1.00 repayment fee applies upon settlement.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <FileText className="h-5 w-5 text-violet" /> Privacy Protection & Zero-Knowledge Disclosure (§2.0)
            </div>
            <p>
              NovaBank is committed to preserving the privacy of high-net-worth individuals and corporate clients.
            </p>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">1. Data Encryption Standards</h4>
            <p>
              All personal data, card PAN numbers, and transaction logs are encrypted in transit via TLS 1.3 and at rest using AES-256-GCM authenticated encryption. We never sell user telemetry or trading activity to third-party brokers.
            </p>
          </div>
        )}

        {activeTab === 'aml' && (
          <div className="space-y-4 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <ShieldCheck className="h-5 w-5 text-success" /> Anti-Money Laundering & Sanctions Policy (§3.0)
            </div>
            <p>
              NovaBank complies with international Anti-Money Laundering (AML), Counter-Terrorist Financing (CTF), and Office of Foreign Assets Control (OFAC) sanction screening requirements.
            </p>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">1. Real-Time Transaction Screening</h4>
            <p>
              All incoming crypto deposits and outgoing card authorizations undergo automated risk scoring. Transactions exceeding $10,000 USD equivalent may require supplemental source-of-funds verification.
            </p>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-4 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <Percent className="h-5 w-5 text-gold" /> Transparent Fee Schedule (§4.0)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-background border border-glass-border space-y-2 font-mono">
                <div className="text-xs font-bold text-gold">Card Interchange Fees</div>
                <div className="flex justify-between"><span>Transactions &le; $500:</span> <span className="text-ink font-bold">$0.10 USD</span></div>
                <div className="flex justify-between"><span>Transactions $500 - $1,000:</span> <span className="text-ink font-bold">$0.50 USD</span></div>
                <div className="flex justify-between"><span>Transactions &gt; $1,000:</span> <span className="text-ink font-bold">$1.00 USD</span></div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-glass-border space-y-2 font-mono">
                <div className="text-xs font-bold text-violet">Loan & Swap Fees</div>
                <div className="flex justify-between"><span>OTC Exchange Slippage:</span> <span className="text-success font-bold">0.00% (Locked Quote)</span></div>
                <div className="flex justify-between"><span>Loan Origination Fee:</span> <span className="text-success font-bold">$0.00 (Free)</span></div>
                <div className="flex justify-between"><span>Loan Repayment Fee:</span> <span className="text-ink font-bold">$1.00 USD Flat</span></div>
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
