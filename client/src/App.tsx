import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/useAuthStore';
import { api } from './lib/api';
import { Navbar } from './components/Navbar';
import { LiveCryptoTicker } from './components/LiveCryptoTicker';
import { CommandPalette } from './components/CommandPalette';
import { AmbientCanvas } from './components/AmbientCanvas';
import { Footer } from './components/Footer';
import { LandingPage } from './features/landing/LandingPage';
import { BentoDashboard } from './features/dashboard/BentoDashboard';
import { CardsView } from './features/cards/CardsView';
import { LoansView } from './features/loans/LoansView';
import { MarketplaceView } from './features/marketplace/MarketplaceView';
import { SettingsView } from './features/settings/SettingsView';
import { SupportView } from './features/support/SupportView';
import { TermsView } from './features/terms/TermsView';
import { FaqsView } from './features/faqs/FaqsView';
import { AuthModal } from './features/auth/AuthModal';

import { DepositModal } from './features/modals/DepositModal';
import { ConvertModal } from './features/modals/ConvertModal';
import { IssueCardModal } from './features/modals/IssueCardModal';
import { CardChargeModal } from './features/modals/CardChargeModal';
import { LoanModal } from './features/modals/LoanModal';
import { MarketplaceModal } from './features/modals/MarketplaceModal';
import { KycModal } from './features/modals/KycModal';
import { ReferralModal } from './features/modals/ReferralModal';
import { CardDetails, LoanDetails, LedgerEntry } from '@novabank/shared';

export function App() {
  const { user, token, setAuth, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>(token ? 'dashboard' : 'landing');
  const [cmdOpen, setCmdOpen] = useState(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Active Feature Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // App Data State
  const [balances, setBalances] = useState<Record<string, number>>({ USD: 0, BTC: 0, ETH: 0, BNB: 0, SOL: 0, BCH: 0 });
  const [depositAddresses, setDepositAddresses] = useState<Record<string, string>>({});
  const [cards, setCards] = useState<CardDetails[]>([]);
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [history, setHistory] = useState<LedgerEntry[]>([]);

  // Restore Authenticated User Session on Mount
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setAuth(res.data.data, token);
          } else {
            logout();
            setActiveTab('landing');
          }
        } catch (err) {
          console.warn('Session verification failed, resetting token:', err);
          logout();
          setActiveTab('landing');
        }
      } else {
        setActiveTab('landing');
      }
    };
    restoreSession();
  }, [token]);

  // Load User Banking Data
  const refreshData = async () => {
    if (!token) return;
    try {
      // 1. Wallet Summary
      const walletRes = await api.get('/wallets/summary');
      if (walletRes.data.success) {
        setBalances(walletRes.data.data.balances);
        setDepositAddresses(walletRes.data.data.depositAddresses);
      }

      // 2. Cards
      const cardsRes = await api.get('/cards');
      if (cardsRes.data.success) {
        setCards(cardsRes.data.data);
      }

      // 3. Loans
      const loansRes = await api.get('/loans');
      if (loansRes.data.success) {
        setLoans(loansRes.data.data);
      }

      // 4. Ledger History
      const historyRes = await api.get('/wallets/history');
      if (historyRes.data.success) {
        setHistory(historyRes.data.data);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [token]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleCommandSelect = (action: string) => {
    if (action === 'open_cmd') setCmdOpen(true);
    else if (action === 'deposit') setActiveModal('deposit');
    else if (action === 'convert') setActiveModal('convert');
    else if (action === 'issue_card') setActiveModal('issue_card');
    else if (action === 'test_card') setActiveModal('test_card');
    else if (action === 'apply_loan') setActiveModal('loan');
    else if (action === 'marketplace') setActiveModal('marketplace');
    else if (action === 'settings') setActiveTab('settings');
    else if (action === 'support') setActiveTab('support');
    else if (action === 'terms') setActiveTab('terms');
    else if (action === 'faqs') setActiveTab('faqs');
  };

  return (
    <div className="relative min-h-screen bg-background text-ink flex flex-col selection:bg-violet selection:text-white">
      {/* Anime.js Interactive Particles Background */}
      <AmbientCanvas />

      {/* Ambient Lighting Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gold/10 blur-[140px] animate-blob-1" />
        <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet/10 blur-[160px] animate-blob-2" />
        <div className="absolute bottom-[-10%] left-[20%] h-[550px] w-[550px] rounded-full bg-gold/5 blur-[140px] animate-blob-1" />
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenCmd={() => setCmdOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenReferral={() => setActiveModal('referral')}
        onOpenKyc={() => setActiveModal('kyc')}
      />

      {/* Live Crypto Price Ticker (Rendered on non-landing views) */}
      {activeTab !== 'landing' && (
        <LiveCryptoTicker
          onOpenConvert={() => {
            if (!token || !user) handleOpenAuth('login');
            else setActiveModal('convert');
          }}
        />
      )}

      {/* Main Content Area with Framer Motion AnimatePresence */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeTab === 'landing' && (
              <LandingPage
                onOpenAuth={handleOpenAuth}
                onLaunchApp={() => {
                  setActiveTab('dashboard');
                }}
              />
            )}

            {activeTab === 'dashboard' && (
              <BentoDashboard
                onOpenModal={(m) => {
                  if (!token || !user) handleOpenAuth('login');
                  else setActiveModal(m);
                }}
                balances={balances}
                depositAddresses={depositAddresses}
                cards={cards}
                loans={loans}
                history={history}
                refreshData={refreshData}
                onOpenReferral={() => setActiveModal('referral')}
                onOpenKyc={() => setActiveModal('kyc')}
              />
            )}

            {activeTab === 'cards' && (
              <CardsView
                cards={cards}
                onOpenIssueModal={() => {
                  if (!token || !user) handleOpenAuth('login');
                  else setActiveModal('issue_card');
                }}
                onOpenTestModal={() => {
                  if (!token || !user) handleOpenAuth('login');
                  else setActiveModal('test_card');
                }}
              />
            )}

            {activeTab === 'loans' && (
              <LoansView
                loans={loans}
                balances={balances}
                onOpenLoanModal={() => {
                  if (!token || !user) handleOpenAuth('login');
                  else setActiveModal('loan');
                }}
                refreshData={refreshData}
              />
            )}

            {activeTab === 'marketplace' && (
              <MarketplaceView
                balances={balances}
                onOpenConvertModal={() => {
                  if (!token || !user) handleOpenAuth('login');
                  else setActiveModal('convert');
                }}
                onOpenMarketplaceModal={() => {
                  if (!token || !user) handleOpenAuth('login');
                  else setActiveModal('marketplace');
                }}
              />
            )}

            {activeTab === 'settings' && <SettingsView onOpenAuth={handleOpenAuth} />}
            {activeTab === 'support' && <SupportView onOpenAuth={handleOpenAuth} />}
            {activeTab === 'terms' && <TermsView />}
            {activeTab === 'faqs' && <FaqsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenAuth={handleOpenAuth} />

      {/* Command Palette */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onSelectAction={handleCommandSelect} />

      {/* Auth Modal (Sign In / Register / 1-Click Demo Sandbox) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          refreshData();
          setActiveTab('dashboard');
        }}
      />

      {/* Interactive Feature Modals */}
      <DepositModal
        isOpen={activeModal === 'deposit'}
        onClose={() => setActiveModal(null)}
        depositAddresses={depositAddresses}
        onSuccess={refreshData}
      />
      <ConvertModal
        isOpen={activeModal === 'convert'}
        onClose={() => setActiveModal(null)}
        balances={balances}
        onSuccess={refreshData}
        onOpenKyc={() => setActiveModal('kyc')}
      />
      <IssueCardModal
        isOpen={activeModal === 'issue_card'}
        onClose={() => setActiveModal(null)}
        onSuccess={refreshData}
        onOpenKyc={() => setActiveModal('kyc')}
      />
      <CardChargeModal
        isOpen={activeModal === 'test_card'}
        onClose={() => setActiveModal(null)}
        cards={cards}
        onSuccess={refreshData}
      />
      <LoanModal
        isOpen={activeModal === 'loan'}
        onClose={() => setActiveModal(null)}
        balances={balances}
        activeLoans={loans}
        onSuccess={refreshData}
        onOpenKyc={() => setActiveModal('kyc')}
      />
      <MarketplaceModal
        isOpen={activeModal === 'marketplace'}
        onClose={() => setActiveModal(null)}
        balances={balances}
        onSuccess={refreshData}
      />
      <KycModal
        isOpen={activeModal === 'kyc'}
        onClose={() => setActiveModal(null)}
        onSuccess={refreshData}
      />
      <ReferralModal
        isOpen={activeModal === 'referral'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}

export default App;
