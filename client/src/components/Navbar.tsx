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
} from 'lucide-react';

interface NavbarProps {
  onOpenCmd: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCmd, activeTab, setActiveTab, onOpenAuth }) => {
  const { user, logout } = useAuthStore();

  const handleLogoClick = () => {
    if (user) setActiveTab('dashboard');
    else setActiveTab('landing');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-aurora-cyan via-aurora-violet to-aurora-emerald p-[2px]">
            <div className="h-full w-full bg-[#0A0A0F] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-violet">
                N
              </span>
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              NovaBank
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-aurora-violet/20 text-aurora-violet border border-aurora-violet/30">
                PRO 2026
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {[
            { id: 'landing', label: 'Home', icon: Home },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'cards', label: 'Cards', icon: CreditCard },
            { id: 'loans', label: 'Loans', icon: Landmark },
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-aurora-cyan/20 to-aurora-violet/20 text-white border border-white/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
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
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 transition-all"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/10">⌘K</kbd>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <UserIcon className="h-4 w-4 text-aurora-cyan" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-slate-200 leading-tight">{user.fullName}</div>
                  <div className="flex items-center gap-1 text-[10px]">
                    {user.isTwoFactorEnabled ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck className="h-3 w-3" /> 2FA Active
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <ShieldAlert className="h-3 w-3" /> 2FA Off
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
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-violet hover:opacity-90 text-xs font-bold text-white transition-all shadow-md"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Tabs Bar */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-2 border-t border-white/10 text-xs">
        {[
          { id: 'landing', label: 'Home', icon: Home },
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'cards', label: 'Cards', icon: CreditCard },
          { id: 'loans', label: 'Loans', icon: Landmark },
          { id: 'marketplace', label: 'Shop', icon: ShoppingBag },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold ${
                isActive ? 'text-aurora-cyan' : 'text-slate-400'
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
