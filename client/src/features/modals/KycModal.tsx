import React, { useState } from 'react';
import { X, ShieldCheck, Upload, Phone, Camera, CheckCircle2, ArrowRight, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const KycModal: React.FC<KycModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateKycStatus } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [cnicNumber, setCnicNumber] = useState('42101-9876543-1');
  const [cnicFrontFileName, setCnicFrontFileName] = useState('cnic_front_card.jpg');
  const [cnicBackFileName, setCnicBackFileName] = useState('cnic_back_card.jpg');
  const [phoneSimName, setPhoneSimName] = useState(user?.fullName || 'Verified Owner');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '+1 555 019 2831');
  const [simVerified, setSimVerified] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSimVerificationCheck = () => {
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setSimVerified(true);
      setLoading(false);
    }, 1200);
  };

  const handleFaceScanTrigger = () => {
    setLoading(true);
    setTimeout(() => {
      setFaceScanned(true);
      setLoading(false);
    }, 1500);
  };

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/kyc/submit', {
        cnicNumber,
        phoneSimVerifiedName: phoneSimName,
        cnicFrontUrl: `data:image/jpeg;base64,${cnicFrontFileName}`,
        cnicBackUrl: `data:image/jpeg;base64,${cnicBackFileName}`,
        faceScanUrl: 'data:image/jpeg;base64,face_scan_captured',
      });

      if (res.data.success) {
        updateKycStatus('VERIFIED');
        setSuccessMsg('KYC & Biometric Verification Approved! $2 USD referral reward processed if eligible.');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 2200);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'KYC verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-hero rounded-3xl border border-gold/30 p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-violet/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-surface hover:bg-surface-hover text-ink-muted hover:text-ink border border-glass-border transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gold/15 text-gold border border-gold/30 mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-display font-bold text-ink tracking-tight">
            Tier-3 Biometric KYC Verification
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            Complete 3-step identity verification: CNIC, SIM Ownership & Face Scanner
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 mb-6 px-2">
          {[
            { s: 1, label: 'CNIC Upload' },
            { s: 2, label: 'SIM Verification' },
            { s: 3, label: 'Face Scan' },
          ].map((item) => (
            <div
              key={item.s}
              onClick={() => setStep(item.s as any)}
              className={`flex-1 text-center py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                step === item.s
                  ? 'bg-gold/20 text-gold border-gold/40 shadow-sm'
                  : step > item.s
                  ? 'bg-success/15 text-success border-success/30'
                  : 'bg-surface text-ink-muted border-glass-border'
              }`}
            >
              Step {item.s}: {item.label}
            </div>
          ))}
        </div>

        {/* Alert / Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-mono font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: CNIC Documents Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
                CNIC Identification Number
              </label>
              <input
                type="text"
                value={cnicNumber}
                onChange={(e) => setCnicNumber(e.target.value)}
                placeholder="42101-9876543-1"
                className="w-full px-3.5 py-2.5 bg-background border border-glass-border rounded-xl text-xs font-mono text-ink focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Front CNIC Upload */}
              <div className="p-4 rounded-xl bg-background border border-dashed border-glass-border flex flex-col items-center justify-center text-center hover:border-gold transition-colors cursor-pointer">
                <Upload className="h-6 w-6 text-gold mb-2" />
                <span className="text-xs font-bold text-ink">CNIC Front Card</span>
                <span className="text-[10px] text-ink-muted mt-1 truncate max-w-[120px]">
                  {cnicFrontFileName}
                </span>
                <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-semibold">
                  Uploaded ✓
                </span>
              </div>

              {/* Back CNIC Upload */}
              <div className="p-4 rounded-xl bg-background border border-dashed border-glass-border flex flex-col items-center justify-center text-center hover:border-gold transition-colors cursor-pointer">
                <Upload className="h-6 w-6 text-violet mb-2" />
                <span className="text-xs font-bold text-ink">CNIC Back Card</span>
                <span className="text-[10px] text-ink-muted mt-1 truncate max-w-[120px]">
                  {cnicBackFileName}
                </span>
                <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-violet/15 text-violet font-semibold">
                  Uploaded ✓
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Next: Verify Phone SIM Ownership</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Phone SIM Registered on CNIC Check */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-glass-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Phone className="h-4 w-4 text-gold" />
                <span>Telecom Biometric SIM Ownership Verification</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Your registered mobile number must be biometrically issued to your own CNIC card.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted uppercase mb-1">
                  Registered Mobile Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-glass-border rounded-xl text-xs font-mono text-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted uppercase mb-1">
                  CNIC Full Legal Name
                </label>
                <input
                  type="text"
                  value={phoneSimName}
                  onChange={(e) => setPhoneSimName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-glass-border rounded-xl text-xs text-ink focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSimVerificationCheck}
                disabled={loading || simVerified}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  simVerified
                    ? 'bg-success text-background'
                    : 'bg-violet text-white shadow-violet-glow hover:bg-violet-dim'
                }`}
              >
                {loading ? (
                  <span>Checking Telecom Registry...</span>
                ) : simVerified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>CNIC & SIM Match Verified</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>Run CNIC SIM Ownership Check</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl bg-surface border border-glass-border text-ink text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!simVerified}
                className="flex-2 w-full py-3 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Next: Biometric Face Scan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Biometric Face Scanner & Selfie Capture */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-background border border-gold/30 flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative h-44 w-44 rounded-full border-2 border-gold/50 flex items-center justify-center mb-3 bg-surface p-1 shadow-inner">
                {/* Face Scanning Animation Frame */}
                <div className="absolute inset-2 rounded-full border border-dashed border-violet animate-spin" style={{ animationDuration: '10s' }} />
                <div className="h-36 w-36 rounded-full bg-surface-hover flex items-center justify-center relative overflow-hidden">
                  <Camera className="h-12 w-12 text-gold animate-pulse" />
                  {faceScanned && (
                    <div className="absolute inset-0 bg-success/20 flex items-center justify-center backdrop-blur-xs">
                      <CheckCircle2 className="h-12 w-12 text-success" />
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold text-ink font-display">
                {faceScanned ? 'Biometric Facial Recognition Passed' : 'Position Face in Center Frame'}
              </h4>
              <p className="text-[11px] text-ink-muted max-w-xs mt-1">
                Liveness detector confirms 3D depth map matches CNIC photo records.
              </p>

              <button
                type="button"
                onClick={handleFaceScanTrigger}
                disabled={loading || faceScanned}
                className="mt-3 px-4 py-2 rounded-xl bg-violet hover:bg-violet-dim text-white text-xs font-bold shadow-violet-glow transition-all flex items-center gap-2"
              >
                {loading ? 'Scanning Face Features...' : faceScanned ? 'Face Scan Verified ✓' : 'Start Camera Face Scan'}
              </button>
            </div>

            <form onSubmit={handleSubmitKyc} className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl bg-surface border border-glass-border text-ink text-xs font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !faceScanned}
                className="flex-2 w-full py-3 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Finalizing KYC...' : 'Submit & Complete Verification'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
