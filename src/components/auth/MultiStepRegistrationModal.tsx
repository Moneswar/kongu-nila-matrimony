import React, { useState, useEffect } from 'react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { KolamMotif } from '../common/KolamMotif';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Upload,
  User,
  MapPin,
  Briefcase,
  Heart,
  Users,
  Compass,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MultiStepRegistrationModal: React.FC = () => {
  const { isRegistrationModalOpen, closeRegistrationModal, openLoginModal } = useMatrimony();
  const { updateCurrentUser, login } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const totalSteps = 10;

  // Unsaved changes confirm modal
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    name: 'Sowmya Soundararajan',
    gender: 'female',
    dob: '1998-05-15',
    phone: '9842212345',
    email: 'sowmya.s@kongunila.com',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    agreeTerms: true,

    // Step 2: Verification
    otp: '4829',

    // Step 3: Basic Identity
    createdFor: 'myself',
    height: '5 ft 5 in / 165 cm',
    maritalStatus: 'never_married',
    motherTongue: 'Tamil',
    district: 'Coimbatore',
    city: 'Coimbatore',
    nativePlace: 'Pollachi',

    // Step 4: Cultural & Horoscope
    community: 'Kongu Vellalar',
    kootam: 'Vellode Kootam',
    kulaDeivam: 'Sellandi Amman Temple, Perundurai',
    rasi: 'Kanni (Virgo)',
    nakshatra: 'Hastham',
    dosham: 'none',

    // Step 5: Education & Career
    education: 'B.E. Computer Science',
    college: 'PSG College of Technology',
    profession: 'Senior Data Scientist',
    company: 'Robert Bosch Engineering',
    income: '₹ 18 - 22 Lakhs / yr',

    // Step 6: Family
    fatherOccupation: 'Executive Engineer, TNEB (Retd)',
    motherOccupation: 'Homemaker',
    siblings: '1 Elder Brother (Married, Architect in Coimbatore)',
    familyType: 'nuclear',
    familyValues: 'moderate',
    familyStatus: 'middle_class',

    // Step 7: Lifestyle
    foodPreference: 'vegetarian',
    smoking: 'no',
    drinking: 'no',
    hobbies: 'Classical Carnatic Music, Organic Gardening, Badminton',

    // Step 8: Partner Preferences
    prefAgeMin: '26',
    prefAgeMax: '31',
    prefHeight: '5 ft 7 in - 6 ft 1 in',
    prefDistricts: 'Coimbatore, Erode, Tiruppur, Salem, Chennai, Bangalore',
    prefEducation: 'B.E. / M.S. / MBBS / CA / Govt Officer',

    // Step 9: Photo & Privacy
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    photoPrivacy: 'public',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCooldown]);

  if (!isRegistrationModalOpen) return null;

  const validateStep = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        errs.name = 'Please enter your full name.';
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        errs.email = 'Please enter a valid email address.';
      }
      if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
        errs.phone = 'Please enter a valid 10-digit mobile number.';
      }
      if (!formData.password || formData.password.length < 6) {
        errs.password = 'Password must be at least 6 characters.';
      }
      if (formData.password !== formData.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
      if (!formData.agreeTerms) {
        errs.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy.';
      }

      // Age validation (>= 18 for female, >= 21 for male)
      if (formData.dob) {
        const birthYear = new Date(formData.dob).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        const minAge = formData.gender === 'female' ? 18 : 21;
        if (age < minAge) {
          errs.dob = `Minimum age requirement is ${minAge} years.`;
        }
      }
    } else if (step === 2) {
      if (!formData.otp.trim()) {
        errs.otp = 'Please enter the verification code.';
      } else if (formData.otp.trim() !== '4829' && formData.otp.trim().length !== 4) {
        errs.otp = 'Invalid verification code. Please use demo code 4829.';
      }
    } else if (step === 3) {
      if (!formData.nativePlace.trim()) {
        errs.nativePlace = 'Please specify your native town or village.';
      }
    } else if (step === 5) {
      if (!formData.education.trim()) {
        errs.education = 'Please enter your highest educational qualification.';
      }
      if (!formData.profession.trim()) {
        errs.profession = 'Please enter your profession or job title.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < totalSteps) {
      setStep(prev => prev + 1);
      setErrors({});
    } else {
      // Final step: Profile completion
      setIsCompleted(true);
      login();
      updateCurrentUser({
        name: formData.name,
        gender: formData.gender as any,
        age: 26,
        height: formData.height,
        maritalStatus: formData.maritalStatus as any,
        district: formData.district,
        city: formData.city,
        nativePlace: formData.nativePlace,
        community: formData.community,
        subCaste: formData.kootam,
        kootamGothram: formData.kootam,
        kulaDeivam: formData.kulaDeivam,
        education: formData.education,
        college: formData.college,
        profession: formData.profession,
        company: formData.company,
        income: formData.income,
        foodPreference: formData.foodPreference as any,
        fatherOccupation: formData.fatherOccupation,
        motherOccupation: formData.motherOccupation,
        familyType: formData.familyType as any,
        familyValues: formData.familyValues as any,
        photos: [formData.photoUrl],
        photoPrivacy: formData.photoPrivacy as any,
        isVerified: true,
        verificationBadges: {
          mobile: true,
          email: true,
          photo: true,
          idGovt: true,
          horoscopeVerified: true
        }
      });

      showToast('Profile created and verified successfully!', 'success');

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#7A1C2E', '#F3E5AB']
        });
      } catch {
        // ignore
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handleClose = () => {
    if (!isCompleted && step > 1) {
      setShowExitConfirm(true);
    } else {
      closeRegistrationModal();
    }
  };

  const stepTitles = [
    'Account & Credentials',
    'Mobile Verification',
    'Basic Identity & Location',
    'Kongu Cultural Heritage',
    'Education & Career',
    'Family Background',
    'Diet & Lifestyle',
    'Partner Preferences',
    'Profile Photograph & Privacy',
    'Profile Completion'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        id="registration-modal-container"
        className="relative w-full max-w-2xl bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 flex items-center justify-center border border-amber-400/40 shadow-xs">
              <KolamMotif size={24} color="#F3E5AB" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif-brand tracking-wide text-amber-200">
                {isCompleted ? 'Profile Ready' : 'Create Free Matrimonial Profile'}
              </h3>
              <p className="text-xs text-amber-100/80 font-tamil">
                {isCompleted
                  ? 'சுயவிவரப் பதிவு நிறைவடைந்தது'
                  : `படி ${step} / ${totalSteps}: ${stepTitles[step - 1]}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Close Registration Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 shrink-0">
            <div
              className="bg-gradient-to-r from-amber-500 to-[#7A1C2E] h-full transition-all duration-300 shadow-xs"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Step Content Container */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-4 text-xs font-semibold">
          {isCompleted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
                  Vanakkam! Your Matrimonial Profile is 100% Ready!
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  Assigned Profile ID: <strong className="text-[#7A1C2E] dark:text-amber-300">KNM-2025-992</strong>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto font-tamil leading-relaxed bg-[#FAF7F2] dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                உங்கள் சுயவிவரம் வெற்றிகரமாக உருவாக்கப்பட்டுள்ளது. இனி நீங்கள் தகுதியான வரன்களைப் பார்வையிட்டு, ஜாதகப் பொருத்தம் அறிந்து, குடும்பத்தினருடன் தொடர்பு கொள்ளலாம்.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={closeRegistrationModal}
                  className="px-6 py-3 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer"
                >
                  Explore Compatible Matches
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Account Creation & Consent */}
              {step === 1 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                    <h4 className="font-bold text-sm sm:text-base font-serif-brand text-stone-900 dark:text-amber-100">
                      Step 1: Account Credentials (கணக்கு விவரங்கள்)
                    </h4>
                    <span className="text-[11px] text-stone-400">All fields required</span>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      I am creating this profile for: (யாருக்காக பதிவு செய்கிறீர்கள்?)
                    </label>
                    <select
                      value={formData.createdFor}
                      onChange={e => setFormData({ ...formData, createdFor: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                    >
                      <option value="myself">Myself (சுயமாக)</option>
                      <option value="son">My Son (மகன்)</option>
                      <option value="daughter">My Daughter (மகள்)</option>
                      <option value="brother">My Brother (சகோதரன்)</option>
                      <option value="sister">My Sister (சகோதரி)</option>
                      <option value="relative">Relative / Friend (உறவினர் / நண்பர்)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                      Full Name (மணமகன் / மணமகள் பெயர்)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sowmya Soundararajan"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="female">Bride (மணப்பெண்)</option>
                        <option value="male">Groom (மணமகன்)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                      {errors.dob && <p className="text-[11px] text-rose-600 mt-1">{errors.dob}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Mobile Number</label>
                      <div className="flex items-center bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 px-3 py-2">
                        <span className="text-stone-500 font-bold mr-2">+91</span>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10-digit mobile"
                          className="bg-transparent w-full focus:outline-none"
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. name@example.com"
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                      {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Min. 6 characters"
                          className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Confirm Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                      {errors.confirmPassword && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        className="mt-0.5 rounded border-stone-300 text-[#7A1C2E] focus:ring-[#7A1C2E]"
                      />
                      <span className="text-[11px] text-stone-600 dark:text-stone-400 leading-normal font-normal">
                        I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong> for Kongu Nila Matrimony.
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.agreeTerms}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Account Verification */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                      <Smartphone className="w-5 h-5" />
                      <span>OTP Verification for +91 {formData.phone}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      In development mode, enter demo verification code <strong>4829</strong> to continue.
                    </p>
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                        Enter 4-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={formData.otp}
                        onChange={e => setFormData({ ...formData, otp: e.target.value })}
                        className="w-36 text-center text-lg tracking-widest font-mono font-bold p-2.5 bg-white dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 rounded-xl border border-stone-300 dark:border-stone-600"
                      />
                      {errors.otp && <p className="text-[11px] text-rose-600 mt-1">{errors.otp}</p>}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                      {resendCooldown > 0 ? (
                        <span>Resend OTP in <strong>{resendCooldown}s</strong></span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setResendCooldown(30); showToast('Demo OTP 4829 refreshed', 'info'); }}
                          className="text-[#7A1C2E] dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Basic Identity & Native Details */}
              {step === 3 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif-brand text-stone-900 dark:text-amber-100">
                    Step 3: Basic Identity & Location (அடிப்படை விவரங்கள்)
                  </h4>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Profile Created For</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['myself', 'son', 'daughter', 'brother', 'sister', 'relative'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, createdFor: opt })}
                          className={`p-2 rounded-xl border capitalize transition cursor-pointer ${
                            formData.createdFor === opt
                              ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                              : 'bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Height</label>
                      <select
                        value={formData.height}
                        onChange={e => setFormData({ ...formData, height: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="5 ft 2 in / 157 cm">5 ft 2 in / 157 cm</option>
                        <option value="5 ft 4 in / 162 cm">5 ft 4 in / 162 cm</option>
                        <option value="5 ft 5 in / 165 cm">5 ft 5 in / 165 cm</option>
                        <option value="5 ft 7 in / 170 cm">5 ft 7 in / 170 cm</option>
                        <option value="5 ft 9 in / 175 cm">5 ft 9 in / 175 cm</option>
                        <option value="5 ft 11 in / 180 cm">5 ft 11 in / 180 cm</option>
                        <option value="6 ft 1 in / 185 cm">6 ft 1 in / 185 cm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Marital Status</label>
                      <select
                        value={formData.maritalStatus}
                        onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="never_married">Never Married (மணமாகாதவர்)</option>
                        <option value="divorced">Divorced (விவாகரத்தானவர்)</option>
                        <option value="widowed">Widowed (துணை இழந்தவர்)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Current District</label>
                      <select
                        value={formData.district}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="Coimbatore">Coimbatore (கோவை)</option>
                        <option value="Erode">Erode (ஈரோடு)</option>
                        <option value="Tiruppur">Tiruppur (திருப்பூர்)</option>
                        <option value="Salem">Salem (சேலம்)</option>
                        <option value="Namakkal">Namakkal (நாமக்கல்)</option>
                        <option value="Karur">Karur (கரூர்)</option>
                        <option value="Chennai">Chennai (சென்னை)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Native Town / Village</label>
                      <input
                        type="text"
                        value={formData.nativePlace}
                        onChange={e => setFormData({ ...formData, nativePlace: e.target.value })}
                        placeholder="e.g. Pollachi / Kangeyam"
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                      {errors.nativePlace && <p className="text-[11px] text-rose-600 mt-1">{errors.nativePlace}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Cultural & Horoscope */}
              {step === 4 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif-brand text-amber-900 dark:text-amber-300">
                    Step 4: Kongu Cultural Heritage & Horoscope (கூட்ட முறை & ஜாதகம்)
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Community</label>
                      <input
                        type="text"
                        value={formData.community}
                        readOnly
                        className="w-full p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Kongu Kootam / Gothram</label>
                      <select
                        value={formData.kootam}
                        onChange={e => setFormData({ ...formData, kootam: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="Vellode Kootam">Vellode Kootam (வெள்ளோடு)</option>
                        <option value="Sengunni Kootam">Sengunni Kootam (செங்குண்ணி)</option>
                        <option value="Porulanthai Kootam">Porulanthai Kootam (பொருளந்தை)</option>
                        <option value="Aadai Kootam">Aadai Kootam (ஆடை)</option>
                        <option value="Sempoothan Kootam">Sempoothan Kootam (செம்பூத்தான்)</option>
                        <option value="Pavalan Kootam">Pavalan Kootam (பவளன்)</option>
                        <option value="Kannakkan Kootam">Kannakkan Kootam (கணக்கன்)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Kula Deivam Temple (குலதெய்வம்)</label>
                    <input
                      type="text"
                      value={formData.kulaDeivam}
                      onChange={e => setFormData({ ...formData, kulaDeivam: e.target.value })}
                      placeholder="e.g. Sellandi Amman Temple, Perundurai"
                      className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Rasi (ராசி)</label>
                      <select
                        value={formData.rasi}
                        onChange={e => setFormData({ ...formData, rasi: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="Mesham">Mesham (Aries)</option>
                        <option value="Rishabam">Rishabam (Taurus)</option>
                        <option value="Mithunam">Mithunam (Gemini)</option>
                        <option value="Kadagam">Kadagam (Cancer)</option>
                        <option value="Simmam">Simmam (Leo)</option>
                        <option value="Kanni (Virgo)">Kanni (Virgo)</option>
                        <option value="Thulam">Thulam (Libra)</option>
                        <option value="Viruchigam">Viruchigam (Scorpio)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Nakshatra (நட்சத்திரம்)</label>
                      <select
                        value={formData.nakshatra}
                        onChange={e => setFormData({ ...formData, nakshatra: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="Ashwini">Ashwini</option>
                        <option value="Rohini">Rohini</option>
                        <option value="Hastham">Hastham</option>
                        <option value="Chithirai">Chithirai</option>
                        <option value="Swathi">Swathi</option>
                        <option value="Uthirattathi">Uthirattathi</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Education & Career */}
              {step === 5 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif-brand text-stone-900 dark:text-amber-100">
                    Step 5: Education & Profession (கல்வி & தொழில்)
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Highest Qualification</label>
                      <input
                        type="text"
                        value={formData.education}
                        onChange={e => setFormData({ ...formData, education: e.target.value })}
                        placeholder="e.g. B.E. Computer Science"
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                      {errors.education && <p className="text-[11px] text-rose-600 mt-1">{errors.education}</p>}
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">College / University</label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={e => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. PSG Tech / Anna University"
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Job Role / Designation</label>
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={e => setFormData({ ...formData, profession: e.target.value })}
                        placeholder="e.g. Senior Data Scientist"
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                      {errors.profession && <p className="text-[11px] text-rose-600 mt-1">{errors.profession}</p>}
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Annual Income</label>
                      <select
                        value={formData.income}
                        onChange={e => setFormData({ ...formData, income: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="₹ 7 - 10 Lakhs / yr">₹ 7 - 10 Lakhs / yr</option>
                        <option value="₹ 10 - 15 Lakhs / yr">₹ 10 - 15 Lakhs / yr</option>
                        <option value="₹ 18 - 22 Lakhs / yr">₹ 18 - 22 Lakhs / yr</option>
                        <option value="₹ 25 - 35 Lakhs / yr">₹ 25 - 35 Lakhs / yr</option>
                        <option value="₹ 50+ Lakhs / yr">₹ 50+ Lakhs / yr</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Family Details */}
              {step === 6 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif-brand text-stone-900 dark:text-amber-100">
                    Step 6: Family Background (குடும்ப பின்னணி)
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Father's Occupation</label>
                      <input
                        type="text"
                        value={formData.fatherOccupation}
                        onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Mother's Occupation</label>
                      <input
                        type="text"
                        value={formData.motherOccupation}
                        onChange={e => setFormData({ ...formData, motherOccupation: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Siblings Details</label>
                    <input
                      type="text"
                      value={formData.siblings}
                      onChange={e => setFormData({ ...formData, siblings: e.target.value })}
                      placeholder="e.g. 1 Brother (Married)"
                      className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Family Type</label>
                      <select
                        value={formData.familyType}
                        onChange={e => setFormData({ ...formData, familyType: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="nuclear">Nuclear Family (தனிக்குடும்பம்)</option>
                        <option value="joint">Joint Family (கூட்டுக்குடும்பம்)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Family Values</label>
                      <select
                        value={formData.familyValues}
                        onChange={e => setFormData({ ...formData, familyValues: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      >
                        <option value="moderate">Moderate</option>
                        <option value="traditional">Traditional</option>
                        <option value="liberal">Liberal</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Lifestyle */}
              {step === 7 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif-brand text-stone-900 dark:text-amber-100">
                    Step 7: Diet & Habits (உணவு முறை & பொழுதுபோக்கு)
                  </h4>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Dietary Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['vegetarian', 'non_vegetarian', 'eggetarian'].map(diet => (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => setFormData({ ...formData, foodPreference: diet })}
                          className={`p-2.5 rounded-xl border capitalize transition cursor-pointer ${
                            formData.foodPreference === diet
                              ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                              : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {diet.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Hobbies & Interests</label>
                    <input
                      type="text"
                      value={formData.hobbies}
                      onChange={e => setFormData({ ...formData, hobbies: e.target.value })}
                      placeholder="e.g. Classical Music, Organic Farming, Reading"
                      className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>
              )}

              {/* Step 8: Partner Preferences */}
              {step === 8 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif-brand text-stone-900 dark:text-amber-100">
                    Step 8: Partner Preferences (எதிர்பார்க்கும் வரன்)
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Age Range</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={formData.prefAgeMin}
                          onChange={e => setFormData({ ...formData, prefAgeMin: e.target.value })}
                          className="w-full p-2 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-center"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          value={formData.prefAgeMax}
                          onChange={e => setFormData({ ...formData, prefAgeMax: e.target.value })}
                          className="w-full p-2 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Preferred Height</label>
                      <input
                        type="text"
                        value={formData.prefHeight}
                        onChange={e => setFormData({ ...formData, prefHeight: e.target.value })}
                        className="w-full p-2 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Preferred Locations</label>
                    <input
                      type="text"
                      value={formData.prefDistricts}
                      onChange={e => setFormData({ ...formData, prefDistricts: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>
              )}

              {/* Step 9: Photo & Privacy */}
              {step === 9 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif-brand text-stone-900 dark:text-amber-100">
                    Step 9: Profile Photograph & Privacy (புகைப்படம் & ரகசியம்)
                  </h4>

                  <div className="flex items-center gap-4 p-3 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      className="w-24 h-28 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                    />
                    <div className="space-y-2">
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-tamil">
                        புகைப்படங்கள் இணைக்கப்பட்ட வரன்கள் <strong>4 மடங்கு அதிகமான வரன் அழைப்புகளைப்</strong> பெறுகின்றன.
                      </p>
                      <div className="flex gap-2">
                        <label className="px-3 py-1.5 bg-[#7A1C2E] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                          <input type="file" accept="image/*" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Photo Privacy Preference</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoPrivacy: 'public' })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          formData.photoPrivacy === 'public'
                            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-300 font-bold'
                            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <p className="font-bold">Public (அனைவருக்கும் தெரியும்)</p>
                        <span className="text-[10px] text-stone-500 font-normal">Visible to all registered members</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoPrivacy: 'on_request' })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          formData.photoPrivacy === 'on_request'
                            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-300 font-bold'
                            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <p className="font-bold">Protected (விருப்பம் ஏற்ற பின்)</p>
                        <span className="text-[10px] text-stone-500 font-normal">Visible only after mutual connection</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 10: Profile Completion & Readiness */}
              {step === 10 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-base font-serif-brand text-stone-900 dark:text-amber-100">
                    Step 10: Final Verification & Profile Readiness (சுயவிவர உறுதிப்படுத்தல்)
                  </h4>

                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>All 10 Sections Successfully Completed</span>
                      </div>
                      <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                        Score: 100%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 dark:text-stone-300 pt-1">
                      <div>✓ Mobile + Email Verified</div>
                      <div>✓ Kongu Heritage & Kootam</div>
                      <div>✓ Professional Credentials</div>
                      <div>✓ 10-Porutham Horoscope Set</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isCompleted && (
          <div className="p-4 bg-stone-50 dark:bg-[#140C0E] border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 disabled:opacity-30 hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
                Step {step} of {totalSteps}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>{step === totalSteps ? 'Complete & Activate Profile' : 'Save & Continue'}</span>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leave Onboarding Confirmation Modal */}
      {showExitConfirm && (
        <div
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowExitConfirm(false)}
        >
          <div
            className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-stone-100">
                Leave profile setup?
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Your progress is saved during this session. You can complete your profile later anytime.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                Continue Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  closeRegistrationModal();
                }}
                className="flex-1 py-2.5 bg-[#7A1C2E] hover:bg-[#8B1E34] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
