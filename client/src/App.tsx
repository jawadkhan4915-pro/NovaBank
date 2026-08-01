import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { api } from './lib/api';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { BentoDashboard } from './features/dashboard/BentoDashboard';
import { DepositModal } from './features/modals/DepositModal';
import { ConvertModal } from './features/modals/ConvertModal';
import { IssueCardModal } from './features/modals/IssueCardModal';
import { CardChargeModal } from './features/modals/CardChargeModal';
import { LoanModal } from './features/modals/LoanModal';
import { MarketplaceModal } from './features/modals/MarketplaceModal';
import { CardDetails, LoanDetails, LedgerEntry } from '@novabank/shared';

export function App() {
  const { user, token, setAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cmdOpen, setCmdOpen] = useState(false);

  // Active Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // App Data State
  const [balances, setBalances] = useState<Record<string, number>>({ USD: 0, BTC: 0, ETH: 0, BNB: 0, SOL: 0, BCH: 0 });
  const [depositAddresses, setDepositAddresses] = useState<Record<string, string>>({});
  const [cards, setCards] = useState<CardDetails[]>([]);
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [history, setHistory] = useState<LedgerEntry[]>([]);

  // Initialize Demo Auth if not logged in
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        try {
          // Auto-login or register demo user for instant interactive testing
          const demoEmail = `demo.user_${Math.floor(Math.random() * 1000)}@novabank.io`;
          const res = await api.post('/auth/register', {
            email: demoEmail,
            password: 'Password123!',
            fullName: 'Alex Vance',
            phone: '+1 555 019 2831',
          });

          if (res.data.success) {
            setAuth(res.data.data.user, res.data.data.tokens.accessToken);
          }
        } catch (err) {
          console.error('Auto demo signup error:', err);
        }
      }
    };
    initAuth();
  }, [token, setAuth]);

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

  const handleCommandSelect = (action: string) => {
    if (action === 'open_cmd') setCmdOpen(true);
    else if (action === 'deposit') setActiveModal('deposit');
    else if (action === 'convert') setActiveModal('convert');
    else if (action === 'issue_card') setActiveModal('issue_card');
    else if (action === 'test_card') setActiveModal('test_card');
    else if (action === 'apply_loan') setActiveModal('loan');
    else if (action === 'marketplace') setActiveModal('marketplace');
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-slate-100 flex flex-col selection:bg-aurora-violet selection:text-white">
      {/* Background Liquid Animated Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-aurora-violet/15 blur-[120px] animate-blob-1" />
        <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-aurora-cyan/15 blur-[140px] animate-blob-2" />
        <div className="absolute bottom-[-10%] left-[20%] h-[550px] w-[550px] rounded-full bg-aurora-emerald/10 blur-[130px] animate-blob-1" />
      </div>

      {/* Top Navbar */}
      <Navbar onOpenCmd={() => setCmdOpen(true)} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        <BentoDashboard
          onOpenModal={(m) => setActiveModal(m)}
          balances={balances}
          depositAddresses={depositAddresses}
          cards={cards}
          loans={loans}
          history={history}
          refreshData={refreshData}
        />
      </main>

      {/* Command Palette */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onSelectAction={handleCommandSelect} />

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
      />
      <IssueCardModal
        isOpen={activeModal === 'issue_card'}
        onClose={() => setActiveModal(null)}
        onSuccess={refreshData}
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
      />
      <MarketplaceModal
        isOpen={activeModal === 'marketplace'}
        onClose={() => setActiveModal(null)}
        balances={balances}
        onSuccess={refreshData}
      />
    </div>
  );
}

export default App;
