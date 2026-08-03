import React, { useState } from 'react';
import { HelpCircle, AlertOctagon, Send, PhoneCall, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';
import { SpotlightCard } from '../../components/SpotlightCard';

export const SupportView: React.FC = () => {
  const [frozen, setFrozen] = useState(false);
  const [category, setCategory] = useState('Cards');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Support & Concierge Center
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet/20 text-violet border border-violet/30 font-semibold font-mono">
              24/7 Priority Desk
            </span>
          </h1>
          <p className="text-xs text-ink-muted">Submit priority tickets, emergency security freezes, or contact compliance</p>
        </div>
      </div>

      {/* Emergency Security Freeze Banner */}
      <SpotlightCard
        spotlightColor={frozen ? 'rgba(229, 103, 92, 0.2)' : 'rgba(201, 162, 92, 0.15)'}
        className={`p-6 border ${frozen ? 'border-danger/50 bg-danger/10' : 'border-glass-border'}`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${frozen ? 'bg-danger/20 text-danger border-danger/30' : 'bg-gold/15 text-gold border-gold/30'}`}>
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink font-display">
                Emergency Security Account Freeze
              </h3>
              <p className="text-xs text-ink-muted">
                {frozen
                  ? 'ACCOUNT FROZEN: All outgoing card charges, crypto withdrawals, and loans are currently blocked.'
                  : 'Instantly block all outgoing POS transactions, card charges, and API withdrawals in 1 click.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setFrozen(!frozen)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 ${
              frozen
                ? 'bg-success text-background hover:bg-success/90'
                : 'bg-danger text-white hover:bg-danger/90'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{frozen ? 'Unfreeze Account Now' : 'Freeze All Outgoing Transactions'}</span>
          </button>
        </div>
      </SpotlightCard>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Ticket Submission */}
        <div className="md:col-span-7 space-y-4">
          <SpotlightCard className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gold" />
              <h3 className="text-sm font-bold text-ink font-display">Submit Priority Support Ticket</h3>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-mono text-center space-y-1">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-1" />
                <div className="font-bold">Ticket Submitted Successfully</div>
                <div>Reference ID: TK-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div className="text-ink-muted text-xs">Our Concierge Desk will reply within 15 minutes.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink font-semibold focus:outline-none"
                  >
                    <option value="Cards">Virtual/Physical Payment Cards</option>
                    <option value="Loans">Crypto Collateral Loans & LTV</option>
                    <option value="Conversions">OTC Quote & Exchange Settlement</option>
                    <option value="Security">2FA TOTP & Account Access</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Detailed Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide relevant transaction refs or detail your request..."
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Ticket to Priority Desk</span>
                </button>
              </form>
            )}
          </SpotlightCard>
        </div>

        {/* Right Column: Live Channels */}
        <div className="md:col-span-5 space-y-4">
          <div className="text-xs font-bold text-ink">Direct Desk Channels</div>

          <SpotlightCard className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet/20 text-violet border border-violet/30 flex items-center justify-center">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-ink">Private Concierge Hotline</div>
                <div className="text-xs text-ink-muted font-mono">+1 (800) 555-NOVA-BANK</div>
              </div>
            </div>
            <p className="text-xs text-ink-muted">Available 24/7/365 for Institutional and Premium account holders.</p>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-ink">Compliance & AML Desk</div>
                <div className="text-xs text-ink-muted font-mono">compliance@novabank.io</div>
              </div>
            </div>
            <p className="text-xs text-ink-muted">For Tier-3 KYC verification inquiries or high-volume OTC quote approvals.</p>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
