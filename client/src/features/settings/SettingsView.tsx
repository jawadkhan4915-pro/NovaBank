import React, { useState } from 'react';
import { User, Shield, Lock, KeyRound, Bell, CheckCircle2, AlertTriangle, Smartphone, Mail, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { SpotlightCard } from '../../components/SpotlightCard';

interface SettingsViewProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAuth }) => {
  const { user } = useAuthStore();
  const [twoFactor, setTwoFactor] = useState(user?.isTwoFactorEnabled || false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (newPass !== confirmPass) {
      setMsg('Error: New passwords do not match');
      return;
    }
    setMsg('Success: Password updated successfully');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            Account & Security Settings
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-semibold font-mono">
              AES-256 Protected
            </span>
          </h1>
          <p className="text-xs text-ink-muted">Manage profile details, 2FA TOTP authentication, and preferences</p>
        </div>

        {!user && (
          <button
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-dim text-background text-xs font-bold transition-all shadow-gold-glow"
          >
            Sign In to Manage Settings
          </button>
        )}
      </div>

      {!user && (
        <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-ink text-xs flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-gold">Guest Preview Mode: </span>
            You are browsing settings in preview mode. Sign in to configure 2FA TOTP, update passwords, and manage personal data.
          </div>
          <button
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="px-3.5 py-1.5 rounded-xl bg-gold text-background font-bold text-xs shrink-0 shadow-sm"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="flex bg-surface p-1 rounded-xl border border-glass-border w-full max-w-md">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile' ? 'bg-gold text-background shadow-gold-glow' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security' ? 'bg-violet text-white shadow-violet-glow' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Security & 2FA
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notifications' ? 'bg-surface border border-glass-border text-ink' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Preferences
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-4">
            <SpotlightCard className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-display font-bold text-lg">
                  {user?.fullName ? user.fullName[0] : 'N'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">{user?.fullName || 'NovaBank Member'}</h3>
                  <p className="text-xs text-ink-muted font-mono">{user?.email || 'alex.vance@novabank.io'}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-glass-border text-xs">
                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.fullName || 'Alex Vance'}
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || 'alex.vance@novabank.io'}
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Role / Account Tier</label>
                  <div className="p-2.5 rounded-xl bg-background border border-glass-border flex justify-between items-center font-mono">
                    <span className="font-bold text-gold">{user?.role || 'PREMIUM_MEMBER'}</span>
                    <span className="text-xs text-success">Active Ledger Access</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="md:col-span-5 space-y-4">
            <SpotlightCard spotlightColor="rgba(63, 183, 125, 0.15)" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink font-display flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" /> KYC Verification Status
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-success/20 text-success border border-success/30 text-xs font-mono font-bold">
                  {user?.kycStatus || 'VERIFIED'}
                </span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Your account identity has passed Tier-3 institutional compliance checks. Daily transaction limits are set to $50,000 USD equivalent.
              </p>
            </SpotlightCard>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 space-y-4">
            <SpotlightCard spotlightColor="rgba(108, 92, 231, 0.15)" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet/20 text-violet border border-violet/30 flex items-center justify-center">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">Two-Factor TOTP Auth</h3>
                    <p className="text-xs text-ink-muted">Google Authenticator or Authy TOTP</p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                    twoFactor
                      ? 'bg-success/20 text-success border-success/30'
                      : 'bg-surface border-glass-border text-ink-muted'
                  }`}
                >
                  {twoFactor ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed">
                Require a 6-digit TOTP code for high-value conversions, loan disbursements, and POS transactions.
              </p>

              {twoFactor && (
                <div className="p-4 rounded-xl bg-background border border-violet/30 space-y-2 text-xs">
                  <div className="font-bold text-violet flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> 2FA Security Active
                  </div>
                  <div className="text-ink-muted font-mono">Secret Key: NB-7842-8901-TOTP-SEC</div>
                </div>
              )}
            </SpotlightCard>
          </div>

          <div className="md:col-span-6 space-y-4">
            <SpotlightCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-ink font-display flex items-center gap-2">
                <Lock className="h-4 w-4 text-gold" /> Change Password
              </h3>

              <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-ink-muted font-semibold block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-ink-muted font-semibold block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full bg-background border border-glass-border rounded-xl px-3.5 py-2 text-ink focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all"
                >
                  Update Password
                </button>
              </form>

              {msg && (
                <p className={`text-xs text-center font-mono font-semibold ${msg.startsWith('Success') ? 'text-success' : 'text-danger'}`}>
                  {msg}
                </p>
              )}
            </SpotlightCard>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-2xl">
          <SpotlightCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink font-display flex items-center gap-2">
              <Bell className="h-4 w-4 text-gold" /> System & Notification Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-glass-border">
                <div>
                  <div className="font-bold text-ink">Email Transaction Alerts</div>
                  <div className="text-ink-muted">Receive instant email receipts for card charges & deposits</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-gold cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-glass-border">
                <div>
                  <div className="font-bold text-ink">Loan LTV Risk Alerts</div>
                  <div className="text-ink-muted">Alert when active loan LTV ratio exceeds 70% threshold</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-gold cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-glass-border">
                <div>
                  <div className="font-bold text-ink">Marketing & Release Notes</div>
                  <div className="text-ink-muted">Updates regarding new supported yield vaults and crypto pairs</div>
                </div>
                <input type="checkbox" className="h-4 w-4 accent-gold cursor-pointer" />
              </div>
            </div>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};
