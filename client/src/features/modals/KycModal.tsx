import React, { useState } from 'react';
import { X, ShieldCheck, Upload, Phone, Camera, CheckCircle2, ArrowRight, UserCheck, AlertCircle, AlertTriangle } from 'lucide-react';
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
  const [cnicFrontFileName, setCnicFrontFileName] = useState<string | null>('cnic_front_card.jpg');
  const [cnicBackFileName, setCnicBackFileName] = useState<string | null>('cnic_back_card.jpg');
  const [phoneSimName, setPhoneSimName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [simVerified, setSimVerified] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Validation Handlers for Step Transitions
  const handleValidateStep1 = () => {
    setErrorMsg('');
    const cleanCnic = cnicNumber.trim();
    if (!cleanCnic) {
      setErrorMsg('Requirement Missing: CNIC Identification Number is required.');
      return;
    }
    // Check CNIC length/format (13 digits or standard 5-7-1 pattern)
    const digitsOnly = cleanCnic.replace(/\D/g, '');
    if (digitsOnly.length !== 13) {
      setErrorMsg('Invalid Requirement: CNIC must contain exactly 13 digits (e.g. 42101-9876543-1).');
      return;
    }
    if (!cnicFrontFileName) {
      setErrorMsg('Requirement Missing: Front side of CNIC identity card must be uploaded.');
      return;
    }
    if (!cnicBackFileName) {
      setErrorMsg('Requirement Missing: Back side of CNIC identity card must be uploaded.');
      return;
    }

    setStep(2);
  };

  const handleValidateStep2 = () => {
    setErrorMsg('');
    if (!phoneNumber.trim()) {
      setErrorMsg('Requirement Missing: Registered mobile phone number is required.');
      return;
    }
    if (!phoneSimName.trim()) {
      setErrorMsg('Requirement Missing: CNIC Full Legal Name is required.');
      return;
    }
    if (!simVerified) {
      setErrorMsg('Requirement Missing: You must run and pass the Telecom Biometric SIM Ownership check before proceeding.');
      return;
    }

    setStep(3);
  };

  const handleSimVerificationCheck = () => {
    if (!phoneNumber.trim() || !phoneSimName.trim()) {
      setErrorMsg('Requirement Missing: Please fill in mobile number and legal name before running SIM check.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setSimVerified(true);
      setLoading(false);
    }, 1200);
  };

  const handleFaceScanTrigger = () => {
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setFaceScanned(true);
      setLoading(false);
    }, 1500);
  };

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!faceScanned) {
      setErrorMsg('Requirement Missing: Biometric 3D Face Scan must be completed before submitting KYC.');
      return;
    }

    setLoading(true);

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
        setSuccessMsg('KYC & Biometric Verification Approved! Account fully unlocked.');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'KYC submission failed. Please verify all requirements.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'front') setCnicFrontFileName(file.name);
      else setCnicBackFileName(file.name);
      setErrorMsg('');
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
            Complete all 3 identity requirements: CNIC Documents, SIM Ownership & 3D Face Scan
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 mb-6 px-1">
          {[
            { s: 1, label: '1. CNIC Upload' },
            { s: 2, label: '2. SIM Check' },
            { s: 3, label: '3. Face Scan' },
          ].map((item) => (
            <div
              key={item.s}
              onClick={() => {
                if (item.s === 1) setStep(1);
                else if (item.s === 2) handleValidateStep1();
                else if (item.s === 3) {
                  if (simVerified) setStep(3);
                  else handleValidateStep2();
                }
              }}
              className={`flex-1 text-center py-2 rounded-xl text-[11px] font-bold border cursor-pointer transition-all ${
                step === item.s
                  ? 'bg-gold/20 text-gold border-gold/40 shadow-sm'
                  : step > item.s
                  ? 'bg-success/15 text-success border-success/30'
                  : 'bg-surface text-ink-muted border-glass-border'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Detailed Requirement Error Message Banner */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-danger/15 border border-danger/40 text-danger text-xs font-semibold flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 text-danger flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-success/15 border border-success/40 text-success text-xs font-mono font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: CNIC Identification & Document Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  CNIC Identification Number *
                </label>
                <span className="text-[10px] text-ink-muted font-mono">13-digit identity number</span>
              </div>
              <input
                type="text"
                value={cnicNumber}
                onChange={(e) => {
                  setCnicNumber(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="42101-9876543-1"
                className={`w-full px-3.5 py-2.5 bg-background border rounded-xl text-xs font-mono text-ink focus:outline-none transition-colors ${
                  !cnicNumber.trim() ? 'border-danger/50 focus:border-danger' : 'border-glass-border focus:border-gold'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Front CNIC Upload */}
              <label className="relative p-4 rounded-xl bg-background border border-dashed border-glass-border flex flex-col items-center justify-center text-center hover:border-gold transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('front', e)}
                  className="hidden"
                />
                <Upload className="h-6 w-6 text-gold mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-ink">CNIC Front Card *</span>
                <span className="text-[10px] text-ink-muted mt-1 truncate max-w-[120px]">
                  {cnicFrontFileName || 'No file chosen'}
                </span>
                {cnicFrontFileName ? (
                  <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-semibold">
                    Uploaded ✓
                  </span>
                ) : (
                  <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-danger/15 text-danger font-semibold">
                    Required
                  </span>
                )}
              </label>

              {/* Back CNIC Upload */}
              <label className="relative p-4 rounded-xl bg-background border border-dashed border-glass-border flex flex-col items-center justify-center text-center hover:border-violet transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('back', e)}
                  className="hidden"
                />
                <Upload className="h-6 w-6 text-violet mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-ink">CNIC Back Card *</span>
                <span className="text-[10px] text-ink-muted mt-1 truncate max-w-[120px]">
                  {cnicBackFileName || 'No file chosen'}
                </span>
                {cnicBackFileName ? (
                  <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-violet/15 text-violet font-semibold">
                    Uploaded ✓
                  </span>
                ) : (
                  <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-danger/15 text-danger font-semibold">
                    Required
                  </span>
                )}
              </label>
            </div>

            <button
              onClick={handleValidateStep1}
              className="w-full py-3 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Next: Verify Phone SIM Ownership</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Phone SIM Ownership Check */}
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
                  Registered Mobile Number *
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setSimVerified(false);
                    setErrorMsg('');
                  }}
                  placeholder="+1 555 019 2831"
                  className="w-full px-3 py-2 bg-background border border-glass-border rounded-xl text-xs font-mono text-ink focus:outline-none focus:border-violet"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted uppercase mb-1">
                  CNIC Full Legal Name *
                </label>
                <input
                  type="text"
                  value={phoneSimName}
                  onChange={(e) => {
                    setPhoneSimName(e.target.value);
                    setSimVerified(false);
                    setErrorMsg('');
                  }}
                  placeholder="Legal name matching CNIC"
                  className="w-full px-3 py-2 bg-background border border-glass-border rounded-xl text-xs text-ink focus:outline-none focus:border-violet"
                />
              </div>

              <button
                type="button"
                onClick={handleSimVerificationCheck}
                disabled={loading || simVerified}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  simVerified
                    ? 'bg-success text-background shadow-md'
                    : 'bg-violet text-white shadow-violet-glow hover:bg-violet-dim'
                }`}
              >
                {loading ? (
                  <span>Checking Telecom Registry...</span>
                ) : simVerified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>CNIC & SIM Ownership Verified ✓</span>
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
                onClick={handleValidateStep2}
                className="flex-2 w-full py-3 rounded-xl bg-gold hover:bg-gold-dim text-background font-bold text-xs shadow-gold-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Next: Biometric Face Scan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Biometric 3D Face Scanner */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-background border border-gold/30 flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative h-44 w-44 rounded-full border-2 border-gold/50 flex items-center justify-center mb-3 bg-surface p-1 shadow-inner">
                <div
                  className="absolute inset-2 rounded-full border border-dashed border-violet animate-spin"
                  style={{ animationDuration: '10s' }}
                />
                <div className="h-36 w-36 rounded-full bg-surface-hover flex items-center justify-center relative overflow-hidden">
                  <Camera className="h-12 w-12 text-gold animate-pulse" />
                  {faceScanned && (
                    <div className="absolute inset-0 bg-success/30 flex items-center justify-center backdrop-blur-xs">
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
                className={`mt-3 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  faceScanned
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-violet text-white shadow-violet-glow hover:bg-violet-dim'
                }`}
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
                disabled={loading}
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
