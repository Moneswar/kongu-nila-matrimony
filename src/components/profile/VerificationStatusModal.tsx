import React, { useState } from 'react';
import { Profile } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  X,
  ShieldCheck,
  Phone,
  Mail,
  Camera,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  Sparkles,
  Info,
  Clock,
  Check
} from 'lucide-react';

interface VerificationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  onUpdateVerification: (verificationBadges: Profile['verificationBadges'], isVerified: boolean, trustScore: number) => void;
}

export const VerificationStatusModal: React.FC<VerificationStatusModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateVerification
}) => {
  const { showToast } = useToast();
  const [badges, setBadges] = useState(currentUser.verificationBadges || {
    mobile: true,
    email: true,
    photo: true,
    idGovt: true,
    horoscopeVerified: true
  });
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [activeStep, setActiveStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateVerification = (type: keyof typeof badges) => {
    setIsVerifying(type);
    setTimeout(() => {
      const updated = {
        ...badges,
        [type]: !badges[type]
      };
      setBadges(updated);
      
      const count = Object.values(updated).filter(Boolean).length;
      const newScore = Math.min(100, Math.round((count / 5) * 100));
      const verified = count >= 3;

      onUpdateVerification(updated, verified, newScore);
      setIsVerifying(null);
      setActiveStep(null);
      showToast(
        updated[type]
          ? `Verified badge for ${String(type)} activated! (Demo Mode)`
          : `Verification badge for ${String(type)} toggled off`,
        'success'
      );
    }, 800);
  };

  const calculateScore = () => {
    const count = Object.values(badges).filter(Boolean).length;
    return Math.round((count / 5) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif-brand text-amber-200">
                  Trust & Verification Center
                </h2>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono">
                  Score: {calculateScore()}%
                </span>
              </div>
              <p className="text-xs text-amber-100/80">
                100% verified profiles receive 4x more interest requests from families
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-500/20 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Simulation Notice:</strong> In this prototype preview, verification badges can be simulated to test high-trust and privacy workflows.
          </span>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
          {/* 1. Mobile Phone Verification */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                badges.mobile ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-200 text-stone-600 dark:bg-stone-700'
              }`}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Mobile Verification</h4>
                  {badges.mobile ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-semibold">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  {currentUser.phoneNumber || '+91 98422 12345'} • WhatsApp OTP verification
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSimulateVerification('mobile')}
              disabled={isVerifying === 'mobile'}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                badges.mobile
                  ? 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isVerifying === 'mobile' ? 'Verifying OTP...' : badges.mobile ? 'Re-verify Mobile' : 'Verify Mobile'}
            </button>
          </div>

          {/* 2. Email Address Verification */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                badges.email ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-200 text-stone-600 dark:bg-stone-700'
              }`}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Email Address</h4>
                  {badges.email ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-semibold">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  {currentUser.email || 'user.kongu@matrimony.com'} • Secure link confirmation
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSimulateVerification('email')}
              disabled={isVerifying === 'email'}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                badges.email
                  ? 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isVerifying === 'email' ? 'Sending Link...' : badges.email ? 'Re-verify Email' : 'Verify Email'}
            </button>
          </div>

          {/* 3. Photo Face-Match Verification */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                badges.photo ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-200 text-stone-600 dark:bg-stone-700'
              }`}>
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Photo Verification</h4>
                  {badges.photo ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> 100% Match
                    </span>
                  ) : (
                    <span className="text-[10px] bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-semibold">
                      Pending Selfie
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  AI + Manual portrait matching to eliminate impersonations
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSimulateVerification('photo')}
              disabled={isVerifying === 'photo'}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                badges.photo
                  ? 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isVerifying === 'photo' ? 'Analyzing Selfie...' : badges.photo ? 'Retake Selfie' : 'Verify Photo'}
            </button>
          </div>

          {/* 4. Govt ID Verification */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                badges.idGovt ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-200 text-stone-600 dark:bg-stone-700'
              }`}>
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Government ID (Aadhaar/Passport)</h4>
                  {badges.idGovt ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Govt Verified
                    </span>
                  ) : (
                    <span className="text-[10px] bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-semibold">
                      Unverified
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  Protects families from fake matrimonial profiles. ID is never shown publicly.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSimulateVerification('idGovt')}
              disabled={isVerifying === 'idGovt'}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                badges.idGovt
                  ? 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isVerifying === 'idGovt' ? 'Validating ID...' : badges.idGovt ? 'Update ID' : 'Upload Govt ID'}
            </button>
          </div>

          {/* 5. Horoscope / Jathagam Verification */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                badges.horoscopeVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-200 text-stone-600 dark:bg-stone-700'
              }`}>
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Horoscope Verification</h4>
                  {badges.horoscopeVerified ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Chart Verified
                    </span>
                  ) : (
                    <span className="text-[10px] bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-semibold">
                      Self Declared
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  Birth time & 10-Porutham chart authenticated against Vedic planetary ephemeris
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSimulateVerification('horoscopeVerified')}
              disabled={isVerifying === 'horoscopeVerified'}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                badges.horoscopeVerified
                  ? 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isVerifying === 'horoscopeVerified' ? 'Checking Chart...' : badges.horoscopeVerified ? 'Re-verify Chart' : 'Verify Horoscope'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 dark:bg-stone-850 px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#7A1C2E] hover:bg-[#5C1020] text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
