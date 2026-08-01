import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setAuth } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'register') {
        const res = await api.post('/auth/register', {
          email,
          password,
          fullName: fullName || 'Nova User',
          phone: phone || '+1 555 019 2831',
        });

        if (res.data.success) {
          setAuth(res.data.data.user, res.data.data.tokens.accessToken);
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        const res = await api.post('/auth/login', {
          email,
          password,
          twoFactorCode: requires2FA ? twoFactorCode : undefined,
        });

        if (res.data.success) {
          setAuth(res.data.data.user, res.data.data.tokens.accessToken);
          if (onSuccess) onSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      if (err.response?.data?.error?.code === 'TWO_FACTOR_REQUIRED') {
        setRequires2FA(true);
        setErrorMsg('2FA Authentication code required');
      } else {
        setErrorMsg(err.response?.data?.error?.message || 'Authentication failed. Check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const demoEmail = `demo.trader_${randomId}@novabank.io`;
      const res = await api.post('/auth/register', {
        email: demoEmail,
        password: 'Password123!',
        fullName: `Alex Vance (${randomId})`,
        phone: '+1 555 019 9999',
      });

      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.tokens.accessToken);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Demo session initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-card rounded-3xl border border-white/20 p-6 shadow-2xl relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-aurora-cyan/30 blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-aurora-violet/30 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-aurora-cyan via-aurora-violet to-aurora-emerald p-[2px] mb-3">
            <div className="h-full w-full bg-[#0A0A0F] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-aurora-cyan" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back to NovaBank' : 'Create Your NovaBank Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access multi-asset crypto ledger, virtual debit cards & liquidity'
              : 'Join the next generation of crypto-fiat banking'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'login' ? 'bg-aurora-violet text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'register' ? 'bg-aurora-violet text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aurora-cyan transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 019 2831"
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aurora-cyan transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.vance@novabank.io"
                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aurora-cyan transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aurora-cyan transition-all"
              />
            </div>
          </div>

          {requires2FA && (
            <div>
              <label className="block text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">
                2FA TOTP Authenticator Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-amber-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-amber-500/50 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-emerald hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0A0A0F] px-2 text-slate-500 font-semibold">Or Instant Access</span>
          </div>
        </div>

        {/* Instant Demo Account Button */}
        <button
          type="button"
          onClick={handleDemoAccess}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 group"
        >
          <Sparkles className="h-4 w-4 text-aurora-cyan group-hover:rotate-12 transition-transform" />
          <span>Launch Demo Sandbox Mode (1-Click)</span>
        </button>
      </div>
    </div>
  );
};
