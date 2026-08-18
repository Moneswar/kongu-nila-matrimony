import React, { useState, useEffect } from 'react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { KolamMotif } from '../common/KolamMotif';
import {
  X,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Check,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, openRegistrationModal } = useMatrimony();
  const { login, toggleDemoUser, currentUser } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  // Mode: 'password' | 'otp' | 'forgot_password'
  const [loginMode, setLoginMode] = useState<'password' | 'otp' | 'forgot_password'>('password');

  // Password Login Fields
  const [identifier, setIdentifier] = useState('9842212345');
  const [password, setPassword] = useState('Kongu@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Login Fields
  const [otpMobile, setOtpMobile] = useState('9842212345');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password Fields
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isLoginModalOpen) return null;

  const validatePasswordLogin = () => {
    const errs: { [key: string]: string } = {};
    if (!identifier.trim()) {
      errs.identifier = 'Please enter your registered mobile number, email, or Matrimony ID.';
    }
    if (!password) {
      errs.password = 'Please enter your password.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordLogin()) return;

    login();
    showToast('Welcome back! Successfully signed in.', 'success');
    closeLoginModal();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpMobile.trim() || otpMobile.replace(/\D/g, '').length < 10) {
      setErrors({ otpMobile: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    setErrors({});
    setIsOtpSent(true);
    setOtpCode('4829'); // Demo simulation code
    setResendCooldown(30);
    showToast('Verification OTP generated (Demo code: 4829)', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== '4829' && otpCode.trim().length !== 4) {
      setErrors({ otpCode: 'Invalid OTP. For demonstration, please enter 4829.' });
      return;
    }
    login();
    showToast('Mobile verified! Successfully signed in.', 'success');
    closeLoginModal();
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setOtpCode('4829');
    showToast('New OTP generated: 4829 (Demo mode)', 'info');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotIdentifier.trim()) {
        setErrors({ forgotIdentifier: 'Please enter your registered email or mobile number.' });
        return;
      }
      setErrors({});
      setForgotStep(2);
      setForgotOtp('4829');
      setResendCooldown(30);
      showToast('Password recovery code generated: 4829', 'info');
    } else if (forgotStep === 2) {
      if (forgotOtp.trim() !== '4829' && forgotOtp.trim().length !== 4) {
        setErrors({ forgotOtp: 'Invalid code. Use demo code 4829.' });
        return;
      }
      setErrors({});
      setForgotStep(3);
    } else if (forgotStep === 3) {
      if (newPassword.length < 6) {
        setErrors({ newPassword: 'Password must be at least 6 characters.' });
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setErrors({ confirmNewPassword: 'Passwords do not match.' });
        return;
      }
      showToast('Password updated successfully! Please log in.', 'success');
      setLoginMode('password');
      setForgotStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        id="login-modal-container"
        className="relative w-full max-w-md bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 flex items-center justify-center border border-amber-400/40 shadow-xs">
              <KolamMotif size={24} color="#F3E5AB" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-brand tracking-wide text-amber-200">
                {loginMode === 'forgot_password' ? 'Reset Password' : 'Welcome to Kongu Nila'}
              </h3>
              <p className="text-xs text-amber-100/80 font-tamil">
                {loginMode === 'forgot_password' ? 'கடவுச்சொல் மீட்டமைப்பு' : 'உறுப்பினர் உள்நுழைவு'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLoginModal}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Close Login Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Password vs OTP */}
        {loginMode !== 'forgot_password' && (
          <div className="flex border-b border-stone-200 dark:border-stone-800 text-xs font-bold bg-stone-50/50 dark:bg-stone-900/40">
            <button
              type="button"
              onClick={() => { setLoginMode('password'); setErrors({}); }}
              className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${
                loginMode === 'password'
                  ? 'border-[#7A1C2E] text-[#7A1C2E] dark:border-amber-400 dark:text-amber-300 font-bold bg-white dark:bg-[#160A0D]'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('otp'); setErrors({}); }}
              className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${
                loginMode === 'otp'
                  ? 'border-[#7A1C2E] text-[#7A1C2E] dark:border-amber-400 dark:text-amber-300 font-bold bg-white dark:bg-[#160A0D]'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Instant OTP Login
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                  Registered Mobile / Email / Matrimony ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="e.g. 9842212345 or KNM-2024-811"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.identifier}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-700 dark:text-stone-300 font-bold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setLoginMode('forgot_password'); setErrors({}); }}
                    className="text-[11px] text-[#7A1C2E] dark:text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 pr-10 focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember-me-checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-[#7A1C2E] focus:ring-[#7A1C2E]"
                />
                <label htmlFor="remember-me-checkbox" className="text-stone-600 dark:text-stone-400 font-medium">
                  Keep me signed in on this device
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </form>
          )}

          {loginMode === 'otp' && (
            <div>
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      Registered Mobile Number
                    </label>
                    <div className="flex items-center bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 px-3 py-2.5">
                      <span className="text-stone-500 font-bold mr-2">+91</span>
                      <input
                        type="tel"
                        value={otpMobile}
                        onChange={e => setOtpMobile(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="bg-transparent w-full text-stone-900 dark:text-stone-100 font-bold focus:outline-none"
                      />
                    </div>
                    {errors.otpMobile && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                        {errors.otpMobile}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Generate OTP</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-500/30 text-stone-700 dark:text-amber-200 text-xs">
                    OTP generated for <strong>+91 {otpMobile}</strong> (Prototype Demo Code: <strong>4829</strong>)
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      Enter 4-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="4829"
                      className="w-full text-center text-xl font-mono font-bold tracking-widest px-3 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#7A1C2E]"
                    />
                    {errors.otpCode && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                        {errors.otpCode}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    {resendCooldown > 0 ? (
                      <span className="text-stone-500">
                        Resend OTP in <strong className="text-stone-700 dark:text-stone-300">{resendCooldown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#7A1C2E] dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Resend OTP
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                    >
                      Change Number
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Verify & Sign In</span>
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {loginMode === 'forgot_password' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              {forgotStep === 1 && (
                <>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-xs">
                    Enter your registered email address or mobile number to receive password recovery instructions.
                  </p>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      Email or Mobile Number
                    </label>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={e => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. user@kongunila.com or 9842212345"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                    {errors.forgotIdentifier && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.forgotIdentifier}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#7A1C2E] text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Send Recovery Code
                  </button>
                </>
              )}

              {forgotStep === 2 && (
                <>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-500/30 text-xs">
                    Recovery code generated (Demo: <strong>4829</strong>)
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      Enter Recovery Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={forgotOtp}
                      onChange={e => setForgotOtp(e.target.value)}
                      className="w-full text-center text-lg font-mono font-bold tracking-widest px-3 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                    />
                    {errors.forgotOtp && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.forgotOtp}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#7A1C2E] text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Verify Code
                  </button>
                </>
              )}

              {forgotStep === 3 && (
                <>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                    />
                    {errors.newPassword && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                    />
                    {errors.confirmNewPassword && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.confirmNewPassword}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Update Password & Proceed
                  </button>
                </>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setLoginMode('password'); setForgotStep(1); }}
                  className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Quick Persona Switcher for Evaluation */}
          {loginMode !== 'forgot_password' && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center">
                Instant test personas (Demo Mode):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { toggleDemoUser(0); login(); closeLoginModal(); showToast('Switched persona to Sowmya S (Bride)', 'success'); }}
                  className="p-2 rounded-xl border border-amber-400/80 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-950/60 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sowmya (Bride)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { toggleDemoUser(1); login(); closeLoginModal(); showToast('Switched persona to Dr. Karthik S (Groom)', 'success'); }}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A0F12] text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
                >
                  <span>Karthik (Groom)</span>
                </button>
              </div>
            </div>
          )}

          {loginMode !== 'forgot_password' && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { closeLoginModal(); openRegistrationModal(); }}
                className="text-xs text-[#7A1C2E] dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Don't have an account? Register Free
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
