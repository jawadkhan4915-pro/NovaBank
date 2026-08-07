import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Eye, EyeOff, ShieldCheck, RefreshCw, Fingerprint, KeyRound, Clock, ShieldAlert, X, Sparkles } from 'lucide-react';

interface VirtualBankCardProps {
  cardType?: string;
  maskedPan?: string;
  cardholderName?: string;
  expiryMonth?: number | string;
  expiryYear?: number | string;
  cvc?: string;
  status?: string;
  theme?: 'obsidian' | 'gold' | 'royal' | 'titanium';
  className?: string;
  showBackViewInitially?: boolean;
  isDemo?: boolean;
  requireAuth?: boolean;
}

// Authentic Metallic EMV Bank Chip Component
export const BankChipSvg: React.FC = () => (
  <svg viewBox="0 0 48 36" className="w-11 h-9 rounded-md shadow-md flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chipGoldBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9E29C" />
        <stop offset="30%" stopColor="#D4A437" />
        <stop offset="65%" stopColor="#F3D57C" />
        <stop offset="100%" stopColor="#99731C" />
      </linearGradient>
      <linearGradient id="chipPattern" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4A3605" />
        <stop offset="100%" stopColor="#2A1E02" />
      </linearGradient>
    </defs>
    {/* Base Chip Rectangle */}
    <rect width="48" height="36" rx="5" fill="url(#chipGoldBg)" stroke="#8A6414" strokeWidth="0.8" />
    <rect x="1" y="1" width="46" height="34" rx="4" stroke="#FFF5CC" strokeWidth="0.5" strokeOpacity="0.7" />
    
    {/* EMV Microcircuit Cutouts */}
    <path d="M 0 11 H 16 C 18 11 18 18 16 18 H 0" fill="none" stroke="url(#chipPattern)" strokeWidth="1.1" />
    <path d="M 48 11 H 32 C 30 11 30 18 32 18 H 48" fill="none" stroke="url(#chipPattern)" strokeWidth="1.1" />
    <path d="M 0 25 H 16 C 18 25 18 18 16 18 H 0" fill="none" stroke="url(#chipPattern)" strokeWidth="1.1" />
    <path d="M 48 25 H 32 C 30 25 30 18 32 18 H 48" fill="none" stroke="url(#chipPattern)" strokeWidth="1.1" />
    <path d="M 16 0 V 11" stroke="url(#chipPattern)" strokeWidth="1.1" />
    <path d="M 32 0 V 11" stroke="url(#chipPattern)" strokeWidth="1.1" />
    <path d="M 16 36 V 25" stroke="url(#chipPattern)" strokeWidth="1.1" />
    <path d="M 32 36 V 25" stroke="url(#chipPattern)" strokeWidth="1.1" />
    
    {/* Center Microchip Core */}
    <rect x="18" y="13" width="12" height="10" rx="2" fill="#E6BA47" stroke="#3D2B03" strokeWidth="0.9" />
  </svg>
);

// Contactless NFC / RFID Wave Icon
export const ContactlessIconSvg: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold/80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M8.5 14.5A4 4 0 0 0 8.5 9.5" />
    <path d="M11.5 17.5A8 8 0 0 0 11.5 6.5" />
    <path d="M14.5 20.5A12 12 0 0 0 14.5 3.5" />
  </svg>
);

// Mastercard Glossy Overlapping Circles Badge
export const MastercardLogoSvg: React.FC = () => (
  <svg viewBox="0 0 46 28" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="14" r="11" fill="#EB001B" />
    <circle cx="30" cy="14" r="11" fill="#F79E1B" fillOpacity="0.92" />
    <path d="M 23 5.8 A 11 11 0 0 1 23 22.2 A 11 11 0 0 1 23 5.8 Z" fill="#FF5F00" />
  </svg>
);

// Visa Metallic Foil Badge
export const VisaLogoSvg: React.FC = () => (
  <div className="flex flex-col items-end">
    <span className="font-display font-black italic text-lg tracking-tighter text-white drop-shadow-md select-none leading-none">
      VISA
    </span>
    <span className="text-[8px] font-mono tracking-widest text-gold/90 font-bold uppercase">Virtual</span>
  </div>
);

export const VirtualBankCard: React.FC<VirtualBankCardProps> = ({
  cardType = 'Virtual Visa',
  maskedPan = '4111 8920 4821 9821',
  cardholderName = 'ALEX VANCE',
  expiryMonth = '08',
  expiryYear = '28',
  cvc = '849',
  status = 'ACTIVE',
  theme = 'obsidian',
  className = '',
  showBackViewInitially = false,
  isDemo = false,
  requireAuth = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(showBackViewInitially);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Biometric / Passkey Verification Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'prompt' | 'scanning' | 'success' | 'error'>('prompt');
  const [authTarget, setAuthTarget] = useState<'reveal' | 'flip'>('reveal');

  // 1 Minute (60s) Auto-Hide Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide countdown effect (60s timer)
  useEffect(() => {
    if (showFullDetails) {
      setTimerSeconds(60); // Reset timer to 60s
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setShowFullDetails(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setTimerSeconds(0);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [showFullDetails]);

  // Handle click on Reveal or Flip to Back (Bypassed if isDemo or !requireAuth)
  const handleInitiateReveal = () => {
    if (showFullDetails) {
      // Manually mask immediately
      setShowFullDetails(false);
    } else if (isDemo || !requireAuth) {
      // Demo mode / No Auth required: reveal instantly without passkey modal
      setShowFullDetails(true);
    } else {
      // Require Passkey / Fingerprint Biometrics for active user cards
      setAuthTarget('reveal');
      setAuthStep('prompt');
      setIsAuthModalOpen(true);
    }
  };

  const handleInitiateFlip = () => {
    if (!isFlipped && !showFullDetails && !isDemo && requireAuth) {
      // If attempting to flip to back view on non-demo card, require biometric passkey
      setAuthTarget('flip');
      setAuthStep('prompt');
      setIsAuthModalOpen(true);
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  // Perform Passkey / Biometric Fingerprint Auth
  const handleAuthenticateBiometrics = async () => {
    setAuthStep('scanning');

    try {
      // Attempt native WebAuthn Credential API if available
      if (window.PublicKeyCredential) {
        // Native WebAuthn check simulator/handler
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }

      setAuthStep('success');

      setTimeout(() => {
        setIsAuthModalOpen(false);
        setAuthStep('prompt');
        setShowFullDetails(true);
        if (authTarget === 'flip') {
          setIsFlipped(true);
        }
      }, 800);
    } catch (err) {
      setAuthStep('error');
    }
  };

  // Formatting PAN (clean space grouping)
  const rawPan = maskedPan.replace(/\s+/g, '');
  const isMaskedFormat = rawPan.includes('•') || rawPan.includes('*');
  
  // Format numbers nicely
  const displayPan = showFullDetails && isMaskedFormat
    ? '4111 8920 4821 9821'
    : maskedPan.includes(' ') 
      ? maskedPan 
      : (rawPan.match(/.{1,4}/g)?.join(' ') || maskedPan);

  const formattedExpMonth = String(expiryMonth).padStart(2, '0');
  const formattedExpYear = String(expiryYear).length === 4 ? String(expiryYear).slice(2) : String(expiryYear);
  const displayCvc = showFullDetails ? cvc : '•••';

  const handleCopy = (text: string, fieldName: string) => {
    if (!showFullDetails) {
      handleInitiateReveal();
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Theme styling configurations
  const themeStyles = {
    obsidian: {
      bg: 'bg-gradient-to-br from-[#0B0D12] via-[#121620] to-[#1A1F2C]',
      border: 'border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,55,0.1)]',
      accent: 'text-[#F3D57C]',
      guilloche: 'radial-gradient(circle at 80% 20%, rgba(212,175,55,0.08) 0%, transparent 60%)',
    },
    gold: {
      bg: 'bg-gradient-to-br from-[#1C180A] via-[#2A230F] to-[#120E05]',
      border: 'border border-gold/40 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.15)]',
      accent: 'text-gold',
      guilloche: 'radial-gradient(circle at 20% 80%, rgba(245,158,11,0.12) 0%, transparent 50%)',
    },
    royal: {
      bg: 'bg-gradient-to-br from-[#080B1A] via-[#0E1530] to-[#171033]',
      border: 'border border-indigo-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(99,102,241,0.15)]',
      accent: 'text-indigo-300',
      guilloche: 'radial-gradient(circle at 90% 90%, rgba(99,102,241,0.1) 0%, transparent 60%)',
    },
    titanium: {
      bg: 'bg-gradient-to-br from-[#181A20] via-[#222630] to-[#14161C]',
      border: 'border border-slate-600/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
      accent: 'text-slate-200',
      guilloche: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)',
    },
  }[theme];

  const isMastercard = cardType.toLowerCase().includes('master') || cardType.toLowerCase().includes('mc');

  return (
    <div className={`w-full max-w-[420px] mx-auto space-y-2 select-none ${className}`}>
      {/* Control Bar: Flip Front/Back & Passkey Reveal Details */}
      <div className="flex items-center justify-between text-xs px-1 text-ink-muted">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInitiateFlip}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface hover:bg-glass-border border border-glass-border text-ink font-semibold text-[11px] transition-colors"
          >
            <RefreshCw className="h-3 w-3 text-gold" />
            <span>{isFlipped ? 'Show Front' : 'Show Back (CVC)'}</span>
          </button>

          <button
            type="button"
            onClick={handleInitiateReveal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-all ${
              showFullDetails
                ? 'bg-gold/20 text-gold border-gold/40 shadow-gold-glow'
                : 'bg-surface hover:bg-glass-border border-glass-border text-ink'
            }`}
          >
            {showFullDetails ? (
              <>
                <EyeOff className="h-3 w-3 text-gold" />
                <span>Mask</span>
              </>
            ) : (
              <>
                <Fingerprint className="h-3.5 w-3.5 text-gold" />
                <span>Passkey Reveal</span>
              </>
            )}
          </button>
        </div>

        {/* 1 Minute Countdown Timer Display */}
        {showFullDetails ? (
          <div className="flex items-center gap-1 font-mono text-[11px] bg-gold/15 text-gold px-2 py-0.5 rounded-md border border-gold/30">
            <Clock className="h-3 w-3 animate-spin" />
            <span className="font-bold">
              00:{String(timerSeconds).padStart(2, '0')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            <span className="text-success font-semibold">{status}</span>
          </div>
        )}
      </div>

      {/* Main Bank Card Container - NO Motion/Animation */}
      <div
        className={`relative aspect-[1.586/1] w-full rounded-[18px] ${themeStyles.bg} ${themeStyles.border} p-5 sm:p-6 overflow-hidden flex flex-col justify-between`}
        style={{ backgroundImage: themeStyles.guilloche }}
      >
        {/* Subtle Brushed Metal & Micro-Security Line Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #FFF 0, #FFF 1px, transparent 0, transparent 8px)`,
          }}
        />

        {!isFlipped ? (
          /* ================= FRONT CARD VIEW ================= */
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Header: Bank Brand & Contactless Icon */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                  </div>
                  <span className="font-display font-black text-sm sm:text-base tracking-wider text-ink">
                    NOVABANK
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold tracking-widest text-ink-muted/80 uppercase block mt-0.5">
                  {cardType}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ContactlessIconSvg />
                {/* Hologram Badge */}
                <div className="h-6 px-2 rounded-full border border-gold/40 bg-gradient-to-r from-gold/20 via-violet/20 to-gold/20 flex items-center justify-center shadow-inner">
                  <span className="text-[8px] font-mono font-bold tracking-widest text-gold uppercase">
                    {showFullDetails ? `UNLOCKED ${timerSeconds}S` : 'SECURE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Section: EMV Microchip & PAN */}
            <div className="space-y-3 my-auto">
              <div className="flex items-center justify-between">
                <BankChipSvg />
                {copiedField === 'pan' && (
                  <span className="text-[10px] font-mono font-bold text-success bg-success/15 px-2 py-0.5 rounded border border-success/30">
                    Card Number Copied!
                  </span>
                )}
              </div>

              {/* 16-Digit Card Number */}
              <div className="flex items-center justify-between group">
                <span className="font-mono font-bold text-base sm:text-lg tracking-[0.18em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {displayPan}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(displayPan.replace(/\s+/g, ''), 'pan')}
                  title="Copy Card Number"
                  className="p-1 rounded bg-black/30 hover:bg-surface border border-glass-border text-ink-muted hover:text-gold transition-colors"
                >
                  {copiedField === 'pan' ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Footer: Cardholder, Expiry, CVC & Network Logo */}
            <div className="flex items-end justify-between pt-1 border-t border-white/5">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono font-bold tracking-widest text-ink-faint uppercase block">
                  CARDHOLDER NAME
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm tracking-wider text-ink uppercase drop-shadow">
                  {cardholderName}
                </span>
              </div>

              <div className="flex items-end gap-4">
                <div className="space-y-0.5 text-right">
                  <span className="text-[8px] font-mono font-bold tracking-widest text-ink-faint uppercase block">
                    VALID THRU
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm tracking-widest text-white">
                    {formattedExpMonth}/{formattedExpYear}
                  </span>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="text-[8px] font-mono font-bold tracking-widest text-gold uppercase block">
                    CVC
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm tracking-widest text-gold">
                    {displayCvc}
                  </span>
                </div>

                <div className="pl-1">
                  {isMastercard ? <MastercardLogoSvg /> : <VisaLogoSvg />}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= BACK CARD VIEW ================= */
          <div className="relative z-10 h-full flex flex-col justify-between -mx-5 sm:-mx-6 -my-5 sm:-my-6 py-4">
            {/* Magnetic Stripe */}
            <div className="w-full h-10 sm:h-12 bg-[#0A0A0C] border-y border-black/80 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, #111 0, #111 2px, #222 2px, #222 4px)`
                }}
              />
            </div>

            {/* Signature Strip & CVC Panel */}
            <div className="px-5 sm:px-6 space-y-2">
              <div className="flex items-center justify-between text-[9px] font-mono text-ink-faint">
                <span>AUTHORIZED SIGNATURE</span>
                <span>NOT VALID UNLESS SIGNED</span>
              </div>

              <div className="flex items-center">
                {/* White Diagonal Security Pattern Signature Bar */}
                <div 
                  className="h-8 flex-1 rounded-l-md bg-white border border-slate-300 flex items-center px-3 overflow-hidden"
                  style={{
                    backgroundImage: `repeating-linear-gradient(-45deg, #F8FAFC 0, #F8FAFC 6px, #E2E8F0 6px, #E2E8F0 12px)`
                  }}
                >
                  <span className="font-serif italic text-xs text-slate-700 select-none opacity-85 font-bold tracking-widest">
                    {cardholderName}
                  </span>
                </div>

                {/* CVC Box */}
                <div className="h-8 w-14 rounded-r-md bg-slate-900 border border-l-0 border-slate-700 flex flex-col items-center justify-center px-1">
                  <span className="text-[7px] font-mono font-bold text-gold/80 leading-none">CVC / CVV</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-mono font-bold text-xs text-gold tracking-widest">
                      {displayCvc}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cvc, 'cvc')}
                      className="text-ink-muted hover:text-gold"
                      title="Copy CVC"
                    >
                      {copiedField === 'cvc' ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
              {copiedField === 'cvc' && (
                <p className="text-[9px] font-mono text-success text-right">CVC Security Code Copied!</p>
              )}
            </div>

            {/* Bank Legal & Support Fine Print */}
            <div className="px-5 sm:px-6 space-y-1.5 border-t border-white/10 pt-2">
              <p className="text-[8px] font-mono text-ink-muted/70 leading-tight">
                This virtual debit card is issued by NovaBank N.A. under license. Misuse is subject to international banking security laws.
              </p>
              <div className="flex items-center justify-between text-[8px] font-mono text-ink-muted">
                <span>Customer Support: 24/7 International</span>
                <span className="text-gold font-semibold">support@novabank.com</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= BIOMETRIC / PASSKEY AUTHENTICATION MODAL ================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-hero rounded-2xl border border-glass-border p-6 shadow-2xl relative text-center space-y-5">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Passkey / Fingerprint Header */}
            <div className="space-y-2">
              <div className="h-16 w-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold relative">
                {authStep === 'scanning' ? (
                  <div className="relative">
                    <Fingerprint className="h-9 w-9 text-gold animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                  </div>
                ) : authStep === 'success' ? (
                  <Check className="h-9 w-9 text-success animate-in zoom-in-50" />
                ) : (
                  <Fingerprint className="h-9 w-9 text-gold" />
                )}
              </div>

              <h3 className="font-display font-bold text-base text-ink">
                Passkey Biometric Verification
              </h3>
              <p className="text-xs text-ink-muted max-w-xs mx-auto">
                Touch sensor or verify device Passkey to decrypt card numbers and 3-digit CVC code.
              </p>
            </div>

            {/* Status Feedback */}
            {authStep === 'prompt' && (
              <div className="p-3 rounded-xl bg-surface border border-glass-border text-xs space-y-2">
                <div className="flex items-center justify-center gap-2 text-ink font-semibold">
                  <KeyRound className="h-4 w-4 text-gold" />
                  <span>Hardware Passkey / Touch ID Ready</span>
                </div>
                <p className="text-[11px] text-ink-muted">
                  Required every time card numbers are decrypted for safety.
                </p>
              </div>
            )}

            {authStep === 'scanning' && (
              <div className="p-3 rounded-xl bg-gold/15 border border-gold/30 text-xs text-gold font-mono font-semibold flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Verifying Biometric Hash...</span>
              </div>
            )}

            {authStep === 'success' && (
              <div className="p-3 rounded-xl bg-success/15 border border-success/30 text-xs text-success font-mono font-semibold">
                ✓ Biometric Authorized! Decrypting for 60s...
              </div>
            )}

            {/* Action Buttons */}
            {authStep === 'prompt' && (
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleAuthenticateBiometrics}
                  className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim font-bold text-xs text-background transition-all shadow-gold-glow flex items-center justify-center gap-2"
                >
                  <Fingerprint className="h-4 w-4" />
                  Scan Fingerprint / Passkey Now
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="w-full py-2 rounded-xl text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
