import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { KolamMotif } from '../components/common/KolamMotif';
import { PhotoManagerModal } from '../components/profile/PhotoManagerModal';
import { VerificationStatusModal } from '../components/profile/VerificationStatusModal';
import { PublicProfilePreviewModal } from '../components/profile/PublicProfilePreviewModal';
import { ProfileSectionModals, EditModalType } from '../components/profile/ProfileSectionModals';
import {
  User,
  Users,
  ShieldCheck,
  Crown,
  Sparkles,
  Edit3,
  Camera,
  Eye,
  SlidersHorizontal,
  Phone,
  Mail,
  Lock,
  Compass,
  Briefcase,
  GraduationCap,
  MapPin,
  Heart,
  Calendar,
  Clock,
  Home,
  Check,
  AlertCircle,
  ChevronRight,
  Shield,
  Layers,
  FileText,
  Star,
  Trash2,
  EyeOff
} from 'lucide-react';

interface MyProfileViewProps {
  setCurrentTab: (tab: string) => void;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({ setCurrentTab }) => {
  const { currentUser, updateCurrentUser, toggleDemoUser, profileCompletion } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();

  // Active sub-tab on mobile / desktop
  const [activeSection, setActiveSection] = useState<string>('all');

  // Modals state
  const [activeEditModal, setActiveEditModal] = useState<EditModalType>(null);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Horoscope delete confirmation dialog
  const [isConfirmDeleteHoroscope, setIsConfirmDeleteHoroscope] = useState(false);

  const { score, missing, missingSections } = profileCompletion;

  const handleUpdatePhotos = (
    photos: string[],
    captions: Record<string, string>,
    photoPrivacy: 'public' | 'members_only' | 'on_request'
  ) => {
    updateCurrentUser({
      photos,
      photoCaptions: captions,
      photoPrivacy
    });
  };

  const handleUpdateVerification = (
    verificationBadges: any,
    isVerified: boolean,
    trustScore: number
  ) => {
    updateCurrentUser({
      verificationBadges,
      isVerified,
      trustScore
    });
  };

  const handleDeleteHoroscope = () => {
    updateCurrentUser({
      horoscope: {
        rasi: '',
        nakshatra: '',
        birthPlace: '',
        birthDate: '',
        birthTime: '',
        dosham: 'no_dosham',
        horoscopeAvailable: false
      },
      horoscopeHidden: true
    });
    setIsConfirmDeleteHoroscope(false);
    showToast('Horoscope details cleared', 'info');
  };

  const handleToggleHideHoroscope = () => {
    const nextState = !currentUser.horoscopeHidden;
    updateCurrentUser({ horoscopeHidden: nextState });
    showToast(
      nextState ? 'Horoscope is now hidden from public view' : 'Horoscope is now visible to matches',
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Top Profile Hero Card */}
      <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <KolamMotif size={180} color="#F3E5AB" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            {/* Avatar with Photo Manager Trigger */}
            <div className="relative group">
              <img
                src={currentUser.photos[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
              />
              <button
                type="button"
                onClick={() => setIsPhotoManagerOpen(true)}
                className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition duration-200 text-xs font-bold gap-1"
                title="Manage Photos"
              >
                <Camera className="w-5 h-5 text-amber-300" />
                <span>Edit Photos</span>
              </button>

              {/* Verified Pill */}
              <div
                onClick={() => setIsVerificationModalOpen(true)}
                className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white flex items-center gap-1 shadow-md cursor-pointer"
                title="Click to view verification status"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentUser.isVerified ? 'Verified' : 'Verify'}</span>
              </div>
            </div>

            {/* User Meta Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif-brand text-amber-100">
                  {currentUser.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-400/40 font-mono">
                  {currentUser.profileId}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-amber-200/90">
                {currentUser.age} Yrs • {currentUser.height} • {currentUser.profession}
              </p>
              <p className="text-xs text-amber-300/80 font-tamil">
                Native: {currentUser.nativePlace} • Settled: {currentUser.city} • {currentUser.kootamGothram || 'Kongu Kootam'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="flex items-center gap-1 text-amber-300 font-bold bg-black/30 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  {currentUser.membershipTier.toUpperCase()} Member
                </span>
                <span className="text-emerald-300 font-semibold bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                  Trust Score: {currentUser.trustScore || 95}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 relative z-10 shrink-0">
            {/* View My Profile (Preview Mode) */}
            <button
              id="btn-view-my-profile"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold rounded-xl text-xs shadow-md hover:scale-105 transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-stone-950" />
              <span>View My Profile</span>
            </button>

            {/* Photo Manager */}
            <button
              onClick={() => setIsPhotoManagerOpen(true)}
              className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-xl text-xs font-bold text-amber-200 transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>Manage Photos ({currentUser.photos.length})</span>
            </button>

            {/* Switch Demo User */}
            <button
              onClick={() => toggleDemoUser()}
              className="px-3 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-amber-100 transition flex items-center gap-1"
              title="Switch between Groom & Bride Demo profiles"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Switch Persona</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Profile Completion Bar & Checklist */}
      <div className="bg-white dark:bg-[#1A0F12] p-6 sm:p-7 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                Profile Completion
              </h2>
              <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                {score}%
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Higher completed profiles receive 4x more responses from verified Kongu families.
            </p>
          </div>

          {missingSections && missingSections.length > 0 && (
            <button
              id="btn-complete-profile"
              onClick={() => {
                const targetKey = missingSections[0].sectionKey;
                if (targetKey === 'photos') setIsPhotoManagerOpen(true);
                else setActiveEditModal(targetKey as EditModalType);
              }}
              className="px-5 py-2.5 bg-[#7A1C2E] hover:bg-[#5C1020] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Complete Profile</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-amber-500 via-[#7A1C2E] to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(10, score)}%` }}
          />
        </div>

        {/* Missing Recommendations / Completed Highlights */}
        {missing && missing.length > 0 ? (
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Missing details to reach 100%:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {missingSections?.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.sectionKey === 'photos') setIsPhotoManagerOpen(true);
                    else setActiveEditModal(item.sectionKey as EditModalType);
                  }}
                  className="flex items-center justify-between p-2.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-500/20 rounded-xl text-xs hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold text-amber-900 dark:text-amber-200">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#7A1C2E] dark:text-amber-400 flex items-center">
                    {item.actionText} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Your profile is 100% complete and fully optimized for top matrimonial matching!</span>
          </div>
        )}
      </div>

      {/* 3. Section Navigation Tabs (Responsive) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
        {[
          { id: 'all', label: 'All Sections' },
          { id: 'basic', label: 'Basic Info' },
          { id: 'about', label: 'About Me' },
          { id: 'career', label: 'Education & Career' },
          { id: 'family', label: 'Family & Kootam' },
          { id: 'lifestyle', label: 'Lifestyle & Hobbies' },
          { id: 'horoscope', label: 'Horoscope' },
          { id: 'preferences', label: 'Partner Preferences' },
          { id: 'privacy', label: 'Privacy & Verification' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-[#7A1C2E] text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. MAIN PROFILE SECTIONS */}
      <div className="space-y-6">
        {/* SECTION: BASIC INFORMATION */}
        {(activeSection === 'all' || activeSection === 'basic') && (
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    Basic Information
                  </h3>
                  <span className="text-[11px] text-stone-500">Name, Age, DOB, Native Place & Marital Status</span>
                </div>
              </div>

              <button
                onClick={() => setActiveEditModal('basic')}
                className="px-3.5 py-1.5 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-300/40 transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Full Name</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.name}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Gender & Age</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">
                  {currentUser.gender === 'male' ? 'Groom (Male)' : 'Bride (Female)'} • {currentUser.age} Yrs
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Date of Birth</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.dateOfBirth}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Height</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.height}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Marital Status</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">
                  {currentUser.maritalStatus === 'never_married' ? 'Never Married' : currentUser.maritalStatus}
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Mother Tongue</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.motherTongue || 'Tamil'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Ancestral Native Place</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.nativePlace}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Current Location</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.city}, {currentUser.district}</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ABOUT ME */}
        {(activeSection === 'all' || activeSection === 'about') && (
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    About Me
                  </h3>
                  <span className="text-[11px] text-stone-500">Personal statement, passions & values</span>
                </div>
              </div>

              <button
                onClick={() => setActiveEditModal('about')}
                className="px-3.5 py-1.5 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-300/40 transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-2xl border border-stone-200/60 dark:border-stone-800 text-xs leading-relaxed text-stone-800 dark:text-stone-200">
              {currentUser.aboutMe ? (
                <p>{currentUser.aboutMe}</p>
              ) : (
                <div className="text-stone-400 italic flex items-center justify-between">
                  <span>No description added yet. Write a few sentences to introduce yourself.</span>
                  <button
                    onClick={() => setActiveEditModal('about')}
                    className="text-[#7A1C2E] dark:text-amber-400 font-bold hover:underline not-italic"
                  >
                    + Add Write-up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION: EDUCATION & CAREER */}
        {(activeSection === 'all' || activeSection === 'career') && (
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    Education & Career
                  </h3>
                  <span className="text-[11px] text-stone-500">Degree, college, job role, industry & annual income</span>
                </div>
              </div>

              <button
                onClick={() => setActiveEditModal('career')}
                className="px-3.5 py-1.5 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-300/40 transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Education</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.education}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Degree</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.degree || currentUser.education}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">College / Institution</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.college || currentUser.institution || 'PSG College of Tech'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Profession</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.profession}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Industry</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.industry || 'Information Technology'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Company / Organization</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.company || 'Zoho Corporation'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 sm:col-span-2">
                <span className="text-stone-400 font-bold block text-[10px]">Annual Income</span>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">{currentUser.income}</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: FAMILY DETAILS & KOOTAM */}
        {(activeSection === 'all' || activeSection === 'family') && (
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    Family Details & Lineage
                  </h3>
                  <span className="text-[11px] text-stone-500">Parents, siblings, family values, Kootam & Kula Deivam</span>
                </div>
              </div>

              <button
                onClick={() => setActiveEditModal('family')}
                className="px-3.5 py-1.5 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-300/40 transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Father's Occupation</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.fatherOccupation || 'Business'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Mother's Occupation</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.motherOccupation || 'Homemaker'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Brothers</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">
                  {currentUser.brothersCount} ({currentUser.brothersMarried} Married)
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Sisters</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">
                  {currentUser.sistersCount} ({currentUser.sistersMarried} Married)
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Kongu Kootam</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.kootamGothram || 'Vellode Kootam'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Kula Deivam</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.kulaDeivam || 'Sellandi Amman'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Family Type & Values</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5 capitalize">
                  {currentUser.familyType} • {currentUser.familyValues}
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Family Settled City</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.familyLocation || currentUser.city}</p>
              </div>
            </div>

            {currentUser.aboutFamily && (
              <div className="p-4 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-2xl border border-stone-200/60 dark:border-stone-800 text-xs">
                <span className="text-stone-400 font-bold block text-[10px] mb-1">About Our Family</span>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed">{currentUser.aboutFamily}</p>
              </div>
            )}
          </div>
        )}

        {/* SECTION: LIFESTYLE & HOBBIES */}
        {(activeSection === 'all' || activeSection === 'lifestyle') && (
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    Lifestyle, Habits & Hobbies
                  </h3>
                  <span className="text-[11px] text-stone-500">Food preference, habits, hobbies & languages</span>
                </div>
              </div>

              <button
                onClick={() => setActiveEditModal('lifestyle')}
                className="px-3.5 py-1.5 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-300/40 transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Dietary / Food Preference</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5 capitalize">{currentUser.foodPreference}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Smoking Habit</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.smoking ? 'Yes' : 'No / Non-Smoker'}</p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                <span className="text-stone-400 font-bold block text-[10px]">Drinking Habit</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.drinking ? 'Social Drinker' : 'No / Non-Drinker'}</p>
              </div>
            </div>

            {/* Hobbies Pills */}
            <div className="space-y-2">
              <span className="text-stone-400 font-bold block text-[10px]">Hobbies & Personal Interests</span>
              <div className="flex flex-wrap gap-2">
                {currentUser.hobbies?.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold rounded-xl text-xs border border-amber-200 dark:border-amber-500/20"
                  >
                    {hobby}
                  </span>
                ))}
                {currentUser.interests?.map((interest, idx) => (
                  <span
                    key={`int-${idx}`}
                    className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-xs border border-stone-200 dark:border-stone-700"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Known */}
            <div className="space-y-1 pt-1">
              <span className="text-stone-400 font-bold block text-[10px]">Languages Known</span>
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                {currentUser.languages?.join(', ') || currentUser.motherTongue || 'Tamil, English'}
              </p>
            </div>
          </div>
        )}

        {/* SECTION: HOROSCOPE & ASTROLOGY */}
        {(activeSection === 'all' || activeSection === 'horoscope') && (
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white flex items-center gap-2">
                    <span>Horoscope & Birth Details (ஜாதகம்)</span>
                    {currentUser.horoscopeHidden && (
                      <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-md font-sans font-bold flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Hidden from Public
                      </span>
                    )}
                  </h3>
                  <span className="text-[11px] text-stone-500">Rasi, Nakshatra, Padam, Lagnam & Dosham status</span>
                </div>
              </div>

              {/* Horoscope Actions: Add/Edit, Hide/Show, Delete */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleHideHoroscope}
                  className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
                  title={currentUser.horoscopeHidden ? 'Make Horoscope Visible' : 'Hide Horoscope'}
                >
                  {currentUser.horoscopeHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setActiveEditModal('horoscope')}
                  className="px-3.5 py-1.5 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-300/40 transition flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{currentUser.horoscope?.rasi ? 'Edit' : 'Add Horoscope'}</span>
                </button>

                {currentUser.horoscope?.rasi && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmDeleteHoroscope(true)}
                    className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Horoscope"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {currentUser.horoscope?.rasi ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 font-bold block text-[10px]">Rasi (ராசி)</span>
                  <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.horoscope.rasi}</p>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 font-bold block text-[10px]">Nakshatra (நட்சத்திரம்)</span>
                  <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">
                    {currentUser.horoscope.nakshatra} (Padam {currentUser.horoscope.padam || 1})
                  </p>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 font-bold block text-[10px]">Lagnam (லக்னம்)</span>
                  <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.horoscope.lagnam || 'Mesham'}</p>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 font-bold block text-[10px]">Dosham Status</span>
                  <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5 capitalize">
                    {currentUser.horoscope.dosham === 'no_dosham' ? 'Suddha Jathagam' : currentUser.horoscope.dosham.replace('_', ' ')}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 font-bold block text-[10px]">Birth Date & Time</span>
                  <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">
                    {currentUser.horoscope.birthDate} • {currentUser.horoscope.birthTime}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 sm:col-span-2">
                  <span className="text-stone-400 font-bold block text-[10px]">Birth Place</span>
                  <p className="text-stone-900 dark:text-stone-200 font-bold mt-0.5">{currentUser.horoscope.birthPlace}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/20 space-y-2">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">No Horoscope Attached Yet</p>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  Adding your birth star & 10-Porutham details helps prospective families check horoscope compatibility instantly.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveEditModal('horoscope')}
                  className="px-4 py-2 bg-[#7A1C2E] hover:bg-[#5C1020] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  + Add Horoscope
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION: PARTNER PREFERENCES */}
        {(activeSection === 'all' || activeSection === 'preferences') && (
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    Partner Preferences
                  </h3>
                  <span className="text-[11px] text-stone-500">Age, location, education, profession & community expectations</span>
                </div>
              </div>

              <button
                onClick={() => setActiveEditModal('preferences')}
                className="px-3.5 py-1.5 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-300/40 transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block text-[10px]">Age Range</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold">
                  {currentUser.partnerPreferences?.ageRange[0] || 22} to {currentUser.partnerPreferences?.ageRange[1] || 28} Yrs
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block text-[10px]">Preferred Locations</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold">
                  {currentUser.partnerPreferences?.locations?.join(', ') || 'Coimbatore, Erode, Tiruppur, Chennai'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block text-[10px]">Preferred Education</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold">
                  {currentUser.partnerPreferences?.educationLevels?.join(', ') || 'B.E./B.Tech, MS Abroad, MBBS, CA'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block text-[10px]">Preferred Professions</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold">
                  {currentUser.partnerPreferences?.professions?.join(', ') || 'Software Engineer, Doctor, Business'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block text-[10px]">Diet & Lifestyle</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold capitalize">
                  {currentUser.partnerPreferences?.foodPreference?.join(', ') || 'Vegetarian / Non-Vegetarian'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block text-[10px]">Dosham Acceptance</span>
                <p className="text-stone-900 dark:text-stone-200 font-bold">
                  {currentUser.partnerPreferences?.doshamAcceptable ? 'Acceptable if charts match' : 'Suddha Jathagam only'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: PRIVACY & VERIFICATION STATUS */}
        {(activeSection === 'all' || activeSection === 'privacy') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Privacy Settings Card */}
            <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400" />
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    Privacy Controls
                  </h3>
                </div>
                <button
                  onClick={() => setActiveEditModal('privacy')}
                  className="px-3 py-1 bg-amber-50 dark:bg-stone-800 text-[#7A1C2E] dark:text-amber-300 font-bold text-xs rounded-lg border border-amber-300/40"
                >
                  Edit Privacy
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Photo Visibility</span>
                  <span className="font-bold text-[#7A1C2E] dark:text-amber-300 capitalize">
                    {currentUser.photoPrivacy || 'public'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Phone Number</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {currentUser.privacySettings?.hidePhoneNumber ? 'Hidden' : 'Visible on Request'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Horoscope Visibility</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {currentUser.horoscopeHidden ? 'Hidden from public' : 'Visible to matches'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Status Card */}
            <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-white">
                    Verification Badges
                  </h3>
                </div>
                <button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-lg border border-emerald-300/40"
                >
                  Manage Badges
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Mobile Phone</span>
                    <span className="text-[10px] opacity-80">Verified via OTP</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Email Address</span>
                    <span className="text-[10px] opacity-80">Verified</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Govt ID Proof</span>
                    <span className="text-[10px] opacity-80">Aadhaar/Passport</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Selfie Photo</span>
                    <span className="text-[10px] opacity-80">100% Face Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Photo Manager Modal */}
      <PhotoManagerModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        currentUser={currentUser}
        onUpdatePhotos={handleUpdatePhotos}
      />

      {/* 2. Verification Status Modal */}
      <VerificationStatusModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        currentUser={currentUser}
        onUpdateVerification={handleUpdateVerification}
      />

      {/* 3. Live Public Profile Preview Modal */}
      <PublicProfilePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        currentUser={currentUser}
      />

      {/* 4. Modular Section Edit Forms */}
      <ProfileSectionModals
        activeModal={activeEditModal}
        onClose={() => setActiveEditModal(null)}
        currentUser={currentUser}
        onSaveProfile={(updates) => updateCurrentUser(updates)}
      />

      {/* Delete Horoscope Dialog */}
      {isConfirmDeleteHoroscope && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-stone-900 dark:text-white">Clear Horoscope Data?</h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Are you sure you want to remove your birth star, rasi and planetary chart details from this profile?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteHoroscope(false)}
                className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteHoroscope}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
