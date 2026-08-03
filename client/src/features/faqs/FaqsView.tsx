import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, CreditCard, Landmark, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { SpotlightCard } from '../../components/SpotlightCard';

interface FaqItem {
  id: string;
  category: 'Cards' | 'Loans' | 'OTC Swaps' | 'Security';
  question: string;
  answer: string;
}

export const FaqsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>('1');

  const faqs: FaqItem[] = [
    {
      id: '1',
      category: 'Cards',
      question: 'How do virtual NovaBank cards work for online & POS purchases?',
      answer:
        'NovaBank virtual cards are instantly issued Visa/Mastercard payment credentials linked to your multi-currency wallet. When you swipe a card or pay online, real-time POS spend authorization debits your USD balance or auto-converts crypto at live market rates.',
    },
    {
      id: '2',
      category: 'Cards',
      question: 'What are the interchange fees for POS card transactions?',
      answer:
        'Card interchange fees follow a predictable 3-tier rule: $0.10 for purchases ≤$500, $0.50 for purchases between $500–$1,000, and $1.00 for purchases >$1,000.',
    },
    {
      id: '3',
      category: 'Loans',
      question: 'What is the maximum allowed Loan-to-Value (LTV) ratio?',
      answer:
        'You can borrow USD fiat up to 50% LTV of your locked crypto collateral (BTC, ETH, SOL, BNB, BCH). Zero credit checks are required, and disbursements are instant.',
    },
    {
      id: '4',
      category: 'Loans',
      question: 'What happens if my collateral drops in market value?',
      answer:
        'Our LTV gauge monitors your loan health in real time. If your LTV ratio exceeds 75% due to collateral depreciation, a warning alert is sent. You can top up collateral or make a partial repayment (with a flat $1 fee) to restore healthy LTV (<50%).',
    },
    {
      id: '5',
      category: 'OTC Swaps',
      question: 'How does the guaranteed 15-second locked conversion quote work?',
      answer:
        'When requesting a crypto-to-USD quote, NovaBank locks the live exchange rate for 15 seconds. If you confirm within 15 seconds, the conversion is guaranteed with 0% slippage.',
    },
    {
      id: '6',
      category: 'Security',
      question: 'How does 2FA TOTP authentication protect my ledger balance?',
      answer:
        'Enabling 2FA TOTP requires a 6-digit code from Google Authenticator or Authy for critical ledger actions like password changes, high-value withdrawals, and security unfreezes.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Frequently Asked Questions
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-semibold font-mono">
              Knowledge Base
            </span>
          </h1>
          <p className="text-xs text-ink-muted">Everything you need to know about NovaBank cards, loans, swaps, and security</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-faint" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search FAQs (e.g. LTV limit, card fees, 2FA, quotes)..."
          className="w-full pl-10 pr-4 py-3 bg-surface border border-glass-border rounded-xl text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold transition-all"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <SpotlightCard className="p-8 text-center text-xs text-ink-faint">
            No FAQ items match your search query "{searchTerm}".
          </SpotlightCard>
        ) : (
          filteredFaqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <SpotlightCard key={item.id} className="p-5 overflow-hidden transition-all">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-background border border-glass-border text-gold">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-ink font-display">{item.question}</h3>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 pt-3 border-t border-glass-border text-xs text-ink-muted leading-relaxed font-sans">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            );
          })
        )}
      </div>
    </div>
  );
};
