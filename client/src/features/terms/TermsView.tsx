import React, { useState } from 'react';
import { FileText, ShieldCheck, Scale, Percent, AlertTriangle, Lock, EyeOff, Landmark, Coins, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '../../components/SpotlightCard';

export const TermsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'aml' | 'fees' | 'risks'>('terms');

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
          <p className="text-xs text-ink-muted">Master online crypto currency banking service agreements, zero-knowledge privacy policies, and regulatory disclosures</p>
        </div>
      </div>

      {/* Legal Sub Navigation Tabs */}
      <div className="flex flex-wrap bg-surface p-1 rounded-xl border border-glass-border w-full max-w-4xl">
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'terms' ? 'bg-gold text-background shadow-gold-glow' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'privacy' ? 'bg-violet text-white shadow-violet-glow' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('aml')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'aml' ? 'bg-surface border border-glass-border text-ink' : 'text-ink-muted hover:text-ink'
          }`}
        >
          AML / KYC Disclosure
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'risks' ? 'bg-surface border border-glass-border text-danger' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Crypto Risk Warning
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'fees' ? 'bg-surface border border-glass-border text-ink' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Fee Schedule
        </button>
      </div>

      {/* Content Area */}
      <SpotlightCard className="p-6 md:p-8 space-y-6">
        {activeTab === 'terms' && (
          <div className="space-y-5 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <Scale className="h-5 w-5 text-gold" /> Master Online Crypto Currency Banking Service Agreement (§1.0)
            </div>
            <p>
              Welcome to NovaBank. By registering an account, utilizing our double-entry ledger console, issuing debit/virtual cards, borrowing against collateral, or conducting OTC conversion quotes, you explicitly agree to these Master Terms of Service.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">1. Tier-3 Identity Verification & Account Eligibility</h4>
            <p>
              Access to crypto-to-fiat conversions, virtual card issuance, and borrowing facilities is subject to Tier-3 identity verification (including valid CNIC identification, telecom SIM ownership check, and 3D liveness face scanning). Accounts without completed KYC remain restricted to deposit viewing.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">2. Crypto Asset Custody & Institutional Multi-Sig Cold Storage</h4>
            <p>
              All digital assets deposited with NovaBank (BTC, ETH, BNB, SOL, BCH) are held in cold-storage HSM multi-signature vaults protected by AES-256-GCM encryption key shares. User balances are accounted for using an immutable cryptographic double-entry ledger.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">3. Collateralized Borrowing & Liquidation Risk Disclosures</h4>
            <p>
              Crypto loans carry a maximum initial Loan-to-Value (LTV) ratio of 50%. Borrowers are required to maintain collateral value. If market volatility causes collateral value to breach the 75% LTV liquidation threshold, NovaBank reserves the right to automatically liquidate collateral to settle outstanding USD principal and accrued fees.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">4. Instant OTC Swap Quote Guarantee</h4>
            <p>
              Conversion rates generated via the NovaBank OTC converter are locked for 15 seconds. Executed trades are final and non-reversible once confirmed on the cryptographic double-entry ledger.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-5 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <FileText className="h-5 w-5 text-violet" /> Online Banking Privacy Policy & Zero-Knowledge Data Safeguards (§2.0)
            </div>
            <p>
              NovaBank is committed to preserving the privacy of high-net-worth individuals, institutional clients, and global crypto users.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2 flex items-center gap-1 text-violet">
              <Lock className="h-3.5 w-3.5" /> 1. End-to-End Financial Encryption Standards
            </h4>
            <p>
              All sensitive PII (CNIC numbers, mobile identity tokens, card PAN numbers, and biometric scans) are encrypted in transit via TLS 1.3 and stored at rest using hardware-isolated AES-256-GCM encryption key modules.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2 flex items-center gap-1 text-violet">
              <EyeOff className="h-3.5 w-3.5" /> 2. Zero Monetization & Third-Party Non-Disclosure
            </h4>
            <p>
              We do not sell, rent, monetise, or distribute user telemetry, transaction habits, or portfolio holdings to third-party ad brokers, data aggregators, or unauthorized external entities.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">3. Consumer Privacy Rights (GDPR & CCPA Compliance)</h4>
            <p>
              Clients retain full rights to request access to their ledger history, update personal details, or request account deletion, subject to mandatory anti-money laundering regulatory data retention obligations (5 years post-account closure).
            </p>
          </div>
        )}

        {activeTab === 'aml' && (
          <div className="space-y-5 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <ShieldCheck className="h-5 w-5 text-success" /> Anti-Money Laundering (AML), CTF & FATF Travel Rule Disclosure (§3.0)
            </div>
            <p>
              NovaBank adheres to strict global financial intelligence directives, including US FinCEN rules, EU 6th Anti-Money Laundering Directive (6AMLD), and FATF Recommendation 16 (Travel Rule).
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">1. Real-Time On-Chain & Fiat Sanctions Screening</h4>
            <p>
              Incoming blockchain transactions and card POS authorizations undergo real-time screening against OFAC, EU, UN, and PEP sanction lists. Suspicious wallet addresses linked to darknet markets or illicit mixers will be blocked immediately.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">2. Mandatory Source-of-Funds Verification Thresholds</h4>
            <p>
              Single or aggregate transactions exceeding $10,000 USD equivalent may trigger automated compliance holds pending submission of supplementary source-of-funds documentation.
            </p>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-5 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-danger font-bold text-sm font-display border-b border-glass-border pb-3">
              <AlertTriangle className="h-5 w-5 text-danger" /> Online Crypto Currency Risk Warnings & Non-FDIC Disclosures (§4.0)
            </div>

            <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 space-y-2 text-danger text-xs font-medium">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> IMPORTANT REGULATORY DISCLOSURE
              </div>
              <p>
                Cryptocurrency assets are NOT insured by the Federal Deposit Insurance Corporation (FDIC) or Securities Investor Protection Corporation (SIPC). Digital currencies are subject to extreme price volatility and loss of principal.
              </p>
            </div>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">1. Volatility & Liquidation Warnings</h4>
            <p>
              Digital asset valuations fluctuate rapidly based on market demand and macroeconomic conditions. Borrowers utilizing crypto collateral should monitor their LTV ratios actively to prevent forced liquidation during sudden market drawdowns.
            </p>

            <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono pt-2">2. Network Gas & Blockchain Protocol Risks</h4>
            <p>
              Blockchain transfers are irreversible once broadcast to decentralized networks. Users are responsible for confirming recipient wallet addresses and network compatibility prior to initiating transfers.
            </p>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-5 text-xs text-ink-muted leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-bold text-sm font-display border-b border-glass-border pb-3">
              <Percent className="h-5 w-5 text-gold" /> Transparent Fee Schedule (§5.0)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-background border border-glass-border space-y-2 font-mono">
                <div className="text-xs font-bold text-gold flex items-center gap-1">
                  <Landmark className="h-4 w-4" /> Card Interchange Fees
                </div>
                <div className="flex justify-between border-t border-glass-border pt-1"><span>Transactions &le; $500 USD:</span> <span className="text-ink font-bold">$0.10 USD</span></div>
                <div className="flex justify-between"><span>Transactions $500 - $1,000 USD:</span> <span className="text-ink font-bold">$0.50 USD</span></div>
                <div className="flex justify-between"><span>Transactions &gt; $1,000 USD:</span> <span className="text-ink font-bold">$1.00 USD</span></div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-glass-border space-y-2 font-mono">
                <div className="text-xs font-bold text-violet flex items-center gap-1">
                  <Coins className="h-4 w-4" /> Loan & Swap Fees
                </div>
                <div className="flex justify-between border-t border-glass-border pt-1"><span>OTC Swap Fee:</span> <span className="text-success font-bold">0.00% (Guaranteed Quote)</span></div>
                <div className="flex justify-between"><span>Loan Origination:</span> <span className="text-success font-bold">$0.00 USD (Free)</span></div>
                <div className="flex justify-between"><span>Loan Settlement Fee:</span> <span className="text-ink font-bold">$1.00 USD Flat</span></div>
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
