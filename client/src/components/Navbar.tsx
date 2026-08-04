import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Landmark,
  ShoppingBag,
  Command,
  LogOut,
  User as UserIcon,
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Settings,
  HelpCircle,
  FileText,
  MessageSquare,
  Gift,
} from 'lucide-react';

interface NavbarProps {
  onOpenCmd: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenReferral?: () => void;
  onOpenKyc?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCmd,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenReferral,
  onOpenKyc,
}) => {
  const { user, logout } = useAuthStore();

  const handleLogoClick = () => {
    if (user) setActiveTab('dashboard');
    else setActiveTab('landing');
  };

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'loans', label: 'Loans', icon: Landmark },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-glass-border px-4 lg:px-8 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-gold via-violet to-gold p-[2px]">
            <div className="h-full w-full bg-background rounded-[10px] flex items-center justify-center">
              <span className="font-display font-bold text-xl text-gold">
                N
              </span>
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-ink flex items-center gap-2">
              NovaBank
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-violet/20 text-violet border border-violet/30">
                PRO 2026
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface p-1 rounded-xl border border-glass-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gold/15 text-gold border border-gold/30 shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & User info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCmd}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-glass-border text-xs text-ink-muted transition-all"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-background text-xs font-mono border border-glass-border text-ink-muted">⌘K</kbd>
          </button>

          {/* Invite Friend $2 Button */}
          <button
            onClick={() => {
              if (!user) onOpenAuth('login');
              else if (onOpenReferral) onOpenReferral();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold/20 via-violet/20 to-gold/20 hover:from-gold/30 hover:to-violet/30 border border-gold/40 text-xs font-bold text-gold transition-all shadow-sm"
          >
            <Gift className="h-3.5 w-3.5 text-gold animate-pulse" />
            <span>Invite & Earn $2</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-glass-border cursor-pointer transition-all"
              >
                <UserIcon className="h-4 w-4 text-gold" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-ink leading-tight flex items-center gap-1.5">
                    <span>{user.fullName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold/15 text-gold font-bold border border-gold/30">
                      {user.bankIdNumber || 'NVB-8910'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    {user.kycStatus === 'VERIFIED' ? (
                      <span className="text-success flex items-center gap-0.5 font-semibold">
                        <ShieldCheck className="h-3 w-3" /> KYC Verified
                      </span>
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenKyc) onOpenKyc();
                        }}
                        className="text-gold hover:underline cursor-pointer flex items-center gap-0.5 font-semibold"
                      >
                        <ShieldAlert className="h-3 w-3 text-gold" /> Complete KYC
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setActiveTab('landing');
                }}
                className="p-2 rounded-xl bg-surface hover:bg-danger/20 text-ink-muted hover:text-danger border border-glass-border transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-glass-border text-xs font-bold text-ink transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-dim text-xs font-bold text-background transition-all shadow-gold-glow"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Tabs Bar */}
      <div className="flex md:hidden items-center justify-around gap-1 mt-3 pt-2 border-t border-glass-border text-xs overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[44px] px-2.5 py-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive ? 'text-gold bg-gold/15 border border-gold/30' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
