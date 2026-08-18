import React, { useState, useEffect } from 'react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CompatibilityBadge } from '../common/CompatibilityBadge';
import { KolamMotif } from '../common/KolamMotif';
import { horoscopeService } from '../../services/horoscopeService';
import { membershipService } from '../../services/membershipService';
import { Profile } from '../../types';
import {
  X,
  Heart,
  Bookmark,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  Lock,
  Compass,
  Users,
  CheckCircle2,
  Calendar,
  Eye,
  Share2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Printer,
  FileText,
  Check,
  ShieldAlert,
  Ban,
  Maximize2,
  Sparkle,
  Info,
  ExternalLink,
  BookOpen,
  Building,
  UserCheck,
  Edit3,
  Camera,
  Settings,
  ArrowRight,
  Search
} from 'lucide-react';

export const ProfileDetailModal: React.FC = () => {
  const {
    selectedProfileForDetail: profile,
    isDetailModalOpen,
    closeProfileDetail,
    openProfileDetail,
    shortlists,
    interests,
    toggleShortlist,
    sendInterest,
    acceptInterest,
    declineInterest,
    openChatWith,
    getRelationshipStatus,
    openUpgradeModal,
    profiles
  } = useMatrimony();

  const { currentUser, profileCompletion } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'about' | 'basic' | 'family' | 'horoscope' | 'preferences' | 'journey'>('about');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPhoneUnlocked, setIsPhoneUnlocked] = useState(false);
  const [isBiodataModalOpen, setIsBiodataModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Report & Block Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Fake profile or impersonation');
  const [reportComment, setReportComment] = useState('');
  
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (isBiodataModalOpen) {
          setIsBiodataModalOpen(false);
        } else if (isReportModalOpen) {
          setIsReportModalOpen(false);
        } else if (isBlockModalOpen) {
          setIsBlockModalOpen(false);
        } else if (isDetailModalOpen) {
          closeProfileDetail();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, isBiodataModalOpen, isReportModalOpen, isBlockModalOpen, isDetailModalOpen, closeProfileDetail]);

  if (!isDetailModalOpen) return null;

  // Profile Not Found Fallback Modal
  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-200 dark:border-stone-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-stone-800 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif-brand text-stone-900 dark:text-stone-100">
            Profile Not Found
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            This profile may have been removed, made private by the family, or is currently unavailable.
          </p>
          <button
            type="button"
            onClick={closeProfileDetail}
            className="w-full py-3 bg-[#7A1C2E] hover:bg-[#8B1E34] text-white rounded-xl font-bold text-xs shadow-md transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = Boolean(currentUser && (currentUser.id === profile.id || currentUser.profileId === profile.profileId));
  const relationship = getRelationshipStatus(profile.id);
  const { isShortlisted, interestStatus, interestRecord, isBlocked, canMessage } = relationship;
  const isInterestSent = interestStatus === 'sent_pending' || interestStatus === 'connected';
  const isPhotoPrivate = profile.photoPrivacy === 'on_request' || profile.avatarBlur;

  const fallbackPhoto = profile.gender === 'female'
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

  const photoList = (profile.photos && profile.photos.length > 0) ? profile.photos : [fallbackPhoto];
  const currentPhoto = photoList[activePhotoIdx] || fallbackPhoto;

  const poruthamReport = horoscopeService.calculate10Poruthams(profile.horoscope?.nakshatra || 'Rohini', 'Swathi');

  // Key match reasons
  const matchReasons = profile.compatibility?.reasons && profile.compatibility.reasons.length > 0
    ? profile.compatibility.reasons
    : [
        'Congruent educational qualification and career track',
        'Kongu Vellalar cultural alignment and family values',
        'Western Tamil Nadu native regional proximity',
        'Compatible dietary preferences and lifestyle habits'
      ];

  // Similar Recommended Profiles (same gender preference or similar community)
  const similarProfiles = profiles
    .filter(p => p.id !== profile.id && p.gender === profile.gender)
    .slice(0, 3);

  const handleShareWhatsApp = () => {
    const text = `Kongu Nila Matrimony Profile:\nName: ${profile.name} (${profile.profileId})\nAge: ${profile.age} Yrs, Height: ${profile.height}\nEducation: ${profile.degree}\nProfession: ${profile.profession} (${profile.company})\nKootam: ${profile.kootamGothram || profile.subCaste}\nNative: ${profile.nativePlace} (${profile.district})\nView profile on Kongu Nila Matrimony.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportModalOpen(false);
    showToast(`Profile ${profile.profileId} has been reported. Our Trust & Safety team will review within 24 hours.`, 'info');
    setReportComment('');
  };

  const handleBlockSubmit = () => {
    setIsBlockModalOpen(false);
    showToast(`Profile ${profile.name} (${profile.profileId}) has been blocked.`, 'info');
    closeProfileDetail();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        id="profile-detail-modal-container"
        className="relative w-full max-w-4xl bg-white dark:bg-[#1A0F12] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-stone-200 dark:border-amber-500/20 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#8B1E34] to-[#5C1423] text-white px-5 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <KolamMotif size={24} color="#F3E5AB" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold font-serif-brand tracking-wide text-amber-200">
                  {profile.name}
                </h2>
                {isOwnProfile ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold font-mono">
                    YOUR PROFILE (OWN VIEW)
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-amber-300 border border-amber-500/40 font-mono">
                    {profile.profileId}
                  </span>
                )}
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-700/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-400/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-200" />
                    <span>✓ Verified</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-100/90">
                {profile.age} Yrs • {profile.height} • {profile.city}, {profile.district} (Native: {profile.nativePlace})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBiodataModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Print or View Traditional Kongu Biodata"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Biodata / ஜாதகம்</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white transition flex items-center gap-1 text-xs font-bold cursor-pointer"
              title="Share Profile on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={closeProfileDetail}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Owner Profile Completeness Banner */}
        {isOwnProfile && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 dark:bg-amber-950/40 border-b border-amber-400/30 px-5 py-2.5 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 text-stone-900 dark:text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Profile Completeness: {profileCompletion.score}%</strong> — Higher completeness attracts 3x more family responses.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] text-stone-600 dark:text-stone-400">
                {profileCompletion.missing && profileCompletion.missing.length > 0 ? `Missing: ${profileCompletion.missing.slice(0, 2).join(', ')}` : '100% Complete'}
              </span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Section: Photo Gallery + Primary Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Photo Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border-2 border-amber-500/30 shadow-md group">
                {isPhotoPrivate ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 dark:bg-stone-800">
                    <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-stone-700 flex items-center justify-center text-amber-800 dark:text-amber-300 mb-3 shadow-sm">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      Photo Protected by Family
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Available after mutual interest connection request.
                    </p>
                    <button
                      type="button"
                      onClick={() => sendInterest(profile)}
                      disabled={isInterestSent}
                      className="mt-4 px-4 py-1.5 rounded-xl bg-[#7A1C2E] hover:bg-[#8B1E34] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      {isInterestSent ? 'Interest Sent' : 'Request Access'}
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={currentPhoto}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Fullscreen zoom trigger */}
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs transition cursor-pointer"
                      title="View Fullscreen Photo"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Prev/Next overlay controls if multiple photos */}
                    {photoList.length > 1 && (
                      <div className="absolute inset-x-2 bottom-3 flex items-center justify-between pointer-events-none">
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : photoList.length - 1))}
                          className="pointer-events-auto p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="bg-black/70 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                          {activePhotoIdx + 1} / {photoList.length}
                        </div>
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx(prev => (prev < photoList.length - 1 ? prev + 1 : 0))}
                          className="pointer-events-auto p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Photo Thumbnails */}
              {!isPhotoPrivate && photoList.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-1">
                  {photoList.map((p, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                        activePhotoIdx === idx ? 'border-amber-600 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Actions Row */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                {isOwnProfile ? (
                  <div className="w-full flex items-center justify-between text-stone-600 dark:text-stone-400">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Profile Active & Public
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Redirecting to Profile Settings...', 'info')}
                      className="text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Privacy Settings</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(true)}
                      className="text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsBlockModalOpen(true)}
                      className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Block Profile</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right: Quick Meta Grid */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-300/60">
                      {profile.community} • {profile.kootamGothram || profile.subCaste}
                    </span>
                    {profile.isOnline && (
                      <span className="inline-flex items-center gap-1 bg-stone-950/80 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online Now
                      </span>
                    )}
                  </div>
                  <CompatibilityBadge score={profile.compatibility} />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100 mt-2">
                  {profile.name}
                </h3>

                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mt-0.5">
                  {profile.profession} ({profile.company})
                </p>

                {/* Key Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
                  <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Annual Income</span>
                    <strong className="text-stone-900 dark:text-stone-100 text-sm font-mono">{profile.income}</strong>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Education</span>
                    <strong className="text-stone-900 dark:text-stone-100 truncate block">{profile.degree}</strong>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Native & District</span>
                    <strong className="text-stone-900 dark:text-stone-100">{profile.nativePlace} ({profile.district})</strong>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Kongu Kootam</span>
                    <strong className="text-stone-900 dark:text-amber-300 font-semibold">{profile.kootamGothram || profile.subCaste}</strong>
                  </div>
                </div>

                {/* Kongu Vellalar Lineage & Family Registration Tag */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1 font-tamil">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    கூட்ட முறை: உகந்த வரன் (Lineage Compatible)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold font-tamil">
                    பதிவு: பெற்றோர்களால் நிர்வகிக்கப்படுகிறது (Managed by Parents)
                  </span>
                </div>
              </div>

              {/* Protected Phone / Contact Access */}
              <div className="p-3.5 bg-amber-50/80 dark:bg-stone-900/80 rounded-2xl border border-amber-200 dark:border-amber-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-stone-800 flex items-center justify-center text-[#7A1C2E] dark:text-amber-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Family Contact Number</span>
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                      {isPhoneUnlocked ? (profile.phoneNumber || '+91 98422 14590') : '+91 98422 ••••• (Click to View)'}
                    </span>
                  </div>
                </div>
                {!isPhoneUnlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      const access = membershipService.canAccessFeature(currentUser, 'contact_views');
                      if (!access.allowed) {
                        showToast(access.message, 'info');
                        openUpgradeModal();
                        return;
                      }
                      setIsPhoneUnlocked(true);
                      showToast('Family contact details unlocked successfully.', 'success');
                    }}
                    className="px-3.5 py-1.5 bg-[#7A1C2E] hover:bg-[#8B1E34] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> View Contact
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700">
                    Verified Access Granted
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Profile Deep Dives */}
          <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2.5 rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'about'
                  ? 'border-[#7A1C2E] dark:border-amber-400 text-[#7A1C2E] dark:text-amber-400 bg-amber-50/50 dark:bg-stone-800'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              About & Career
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2.5 rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'border-[#7A1C2E] dark:border-amber-400 text-[#7A1C2E] dark:text-amber-400 bg-amber-50/50 dark:bg-stone-800'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('family')}
              className={`px-4 py-2.5 rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'family'
                  ? 'border-[#7A1C2E] dark:border-amber-400 text-[#7A1C2E] dark:text-amber-400 bg-amber-50/50 dark:bg-stone-800'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Family & Ancestry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('horoscope')}
              className={`px-4 py-2.5 rounded-t-xl transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'horoscope'
                  ? 'border-[#7A1C2E] dark:border-amber-400 text-[#7A1C2E] dark:text-amber-400 bg-amber-50/50 dark:bg-stone-800'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              10 Porutham Horoscope
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2.5 rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'border-[#7A1C2E] dark:border-amber-400 text-[#7A1C2E] dark:text-amber-400 bg-amber-50/50 dark:bg-stone-800'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Partner Preferences
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('journey')}
              className={`px-4 py-2.5 rounded-t-xl transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'journey'
                  ? 'border-[#7A1C2E] dark:border-amber-400 text-[#7A1C2E] dark:text-amber-400 bg-amber-50/50 dark:bg-stone-800'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Match Journey
            </button>
          </div>

          {/* Tab 1: About & Career */}
          {activeTab === 'about' && (
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider text-amber-900 dark:text-amber-400">
                  About Myself
                </h4>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed bg-[#FAF7F2] dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                  {profile.aboutMe || 'Profile bio details maintained under parent supervision.'}
                </p>
              </div>

              {/* Lifestyle Habits & Diet */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Diet / Food</span>
                  <strong className="text-stone-900 dark:text-stone-100 capitalize">{profile.foodPreference?.replace('_', ' ')}</strong>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Smoking</span>
                  <strong className="text-stone-900 dark:text-stone-100">{profile.smoking ? 'Yes' : 'No'}</strong>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Drinking</span>
                  <strong className="text-stone-900 dark:text-stone-100">{profile.drinking ? 'Yes' : 'No'}</strong>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Languages</span>
                  <strong className="text-stone-900 dark:text-stone-100">{profile.languages?.join(', ') || 'Tamil, English'}</strong>
                </div>
              </div>

              {/* Hobbies & Cultural Interests */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider text-amber-900 dark:text-amber-400">
                  Hobbies & Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies && profile.hobbies.map((h, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-stone-700 rounded-full text-xs font-semibold">
                      {h}
                    </span>
                  ))}
                  {profile.interests && profile.interests.map((it, i) => (
                    <span key={`int_${i}`} className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-full text-xs">
                      {it}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Education & Career breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs">
                    <GraduationCap className="w-4 h-4" /> Education Credentials
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Highest Qualification:</strong> {profile.education}
                  </p>
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Degree:</strong> {profile.degree}
                  </p>
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>College / University:</strong> {profile.college}
                  </p>
                </div>

                <div className="p-4 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs">
                    <Briefcase className="w-4 h-4" /> Career & Organization
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Designation:</strong> {profile.designation}
                  </p>
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Organization:</strong> {profile.company}
                  </p>
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Annual CTC:</strong> {profile.income}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Age & Date of Birth</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{profile.age} Yrs ({profile.dateOfBirth})</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Height</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{profile.height}</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Marital Status</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 capitalize">{profile.maritalStatus?.replace('_', ' ')}</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Mother Tongue</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{profile.motherTongue || 'Tamil'}</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Community & Caste</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{profile.community} ({profile.caste})</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Kongu Kootam & Gothram</span>
                  <p className="font-bold text-amber-800 dark:text-amber-300 font-semibold">{profile.kootamGothram || profile.subCaste}</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Kula Deivam (குலதெய்வம்)</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 font-tamil">{profile.kulaDeivam || 'Sellandi Amman / Bannari Mariamman'}</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Current Location & Native</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{profile.city}, {profile.district} • Native: {profile.nativePlace}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Family & Ancestry */}
          {activeTab === 'family' && (
            <div className="space-y-5 text-sm">
              <div className="p-4 bg-amber-50/60 dark:bg-stone-900/60 rounded-2xl border border-amber-200/80 dark:border-stone-700 space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" /> Family Background & Status
                </h4>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-xs sm:text-sm">
                  {profile.aboutFamily || 'Reputed, close-knit family with strong traditional Kongu agricultural and entrepreneurial lineage.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <span className="text-stone-500 dark:text-stone-400">Father's Occupation:</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{profile.fatherOccupation}</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <span className="text-stone-500 dark:text-stone-400">Mother's Occupation:</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{profile.motherOccupation}</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <span className="text-stone-500 dark:text-stone-400">Siblings Details:</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">
                    {profile.brothersCount} Brother ({profile.brothersMarried} Married) • {profile.sistersCount} Sister ({profile.sistersMarried} Married)
                  </p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <span className="text-stone-500 dark:text-stone-400">Family Type & Values:</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 capitalize">
                    {profile.familyType} Family • {profile.familyValues} Values
                  </p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <span className="text-stone-500 dark:text-stone-400">Family Social Status:</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 capitalize">
                    {profile.familyStatus?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <span className="text-stone-500 dark:text-stone-400">Kula Deivam (குலதெய்வம்):</span>
                  <p className="font-bold text-amber-800 dark:text-amber-300 font-tamil">
                    {profile.kulaDeivam || 'Sellandi Amman / Bannari Mariamman'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: 10 Porutham Horoscope */}
          {activeTab === 'horoscope' && (
            <div className="space-y-6">
              {profile.horoscopeHidden ? (
                <div className="p-6 text-center bg-[#FAF7F2] dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    Horoscope Details Are Private
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Horoscope information is shared upon mutual interest acceptance.
                  </p>
                </div>
              ) : (
                <>
                  {/* Top Vedic Match Score Summary */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-stone-900 dark:to-stone-800 rounded-2xl border border-amber-300 dark:border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                        {poruthamReport.score}/10
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">
                          {poruthamReport.verdict}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400 font-tamil">
                          {poruthamReport.verdictTa} • ரஜ்ஜு தட்டு இல்லை (Rajju Passed)
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-semibold text-stone-600 dark:text-stone-400 block">Rasi & Star (ராசி / நட்சத்திரம்):</span>
                      <strong className="text-amber-900 dark:text-amber-300 font-tamil text-sm">
                        {profile.horoscope.rasi} • {profile.horoscope.nakshatra}
                      </strong>
                    </div>
                  </div>

                  {/* 10 Porutham Detailed Table */}
                  <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-3">Porutham (பொருத்தம்)</th>
                          <th className="p-3">Importance</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Significance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                        {poruthamReport.poruthams.map((p, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 transition">
                            <td className="p-3 font-semibold text-stone-900 dark:text-stone-100 font-tamil">
                              {p.nameTa} ({p.name})
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.importance === 'Crucial'
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                              }`}>
                                {p.importance}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 font-tamil">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {p.statusTa}
                              </span>
                            </td>
                            <td className="p-3 text-stone-600 dark:text-stone-400 text-[11px] font-tamil">
                              {p.descriptionTa}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab 5: Partner Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Preferred Age Range</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">26 - 32 Yrs</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Preferred Height</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">5 ft 4 in - 6 ft 2 in</p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Preferred Communities & Kootams</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">
                    Kongu Vellalar (Any Sambandhi Kootam)
                  </p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Preferred Locations</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">
                    Coimbatore, Erode, Tiruppur, Salem, Chennai, Bengaluru, Abroad
                  </p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Education & Profession</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">
                    B.E. / M.S. / MBA / Doctor / CA / Tech Professionals
                  </p>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-500 dark:text-stone-400">Food & Lifestyle</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">Vegetarian / Non-Smoker</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Match Journey Timeline */}
          {activeTab === 'journey' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50/60 dark:bg-stone-900/60 rounded-2xl border border-amber-200 dark:border-stone-700">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider mb-1">
                  Matrimonial Connection Journey
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Track the auspicious milestones of alliance formation between both families with complete clarity.
                </p>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-amber-300 dark:before:bg-stone-700">
                {/* Step 1 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 z-10 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                      1. Profile Viewed & Compatibility Verified
                    </strong>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Calculated 94% Compatibility & 10 Porutham Astrology Alignment.
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 shadow-xs ${
                    isInterestSent ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800 dark:bg-stone-800 dark:text-stone-300'
                  }`}>
                    {isInterestSent ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                      2. Express Interest (விருப்பம் தெரிவித்தல்)
                    </strong>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isInterestSent ? 'Interest sent and acknowledged by candidate.' : 'Click "Send Interest" to initiate mutual family approval.'}
                    </span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center shrink-0 z-10 border border-stone-300 dark:border-stone-700">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                      3. Direct Messaging & Telephonic Discussion
                    </strong>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Engage through secured messaging or requested family phone contact.
                    </span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center shrink-0 z-10 border border-stone-300 dark:border-stone-700">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                      4. Traditional Family Meeting & Vivaham
                    </strong>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Assisted coordinator facilitates the auspicious meeting between families.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Reminder Box */}
          <div className="p-4 bg-amber-50/70 dark:bg-stone-900/80 rounded-2xl border border-amber-300/80 dark:border-stone-700 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 dark:text-stone-300">
              <strong className="text-[#7A1C2E] dark:text-amber-300 block mb-0.5">
                Kongu Nila Safety & Trust Advisory:
              </strong>
              <span>
                Never transfer money, share OTPs, or disclose sensitive financial details. Always independently verify family and lineage background with elders and trusted community references.
              </span>
            </div>
          </div>

          {/* Similar Recommended Profiles */}
          {similarProfiles.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center gap-1.5">
                  <Sparkle className="w-4 h-4 text-amber-500" /> Similar Recommended Matches
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarProfiles.map(sp => (
                  <div
                    key={sp.id}
                    onClick={() => openProfileDetail(sp)}
                    className="p-3 bg-[#FAF7F2] dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 transition cursor-pointer flex items-center gap-3 group"
                  >
                    <img
                      src={sp.photos?.[0] || fallbackPhoto}
                      alt={sp.name}
                      className="w-12 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-stone-900 dark:text-amber-100 truncate group-hover:text-[#7A1C2E] dark:group-hover:text-amber-300">
                        {sp.name}
                      </h5>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        {sp.age} Yrs • {sp.city}
                      </p>
                      <p className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold truncate">
                        {sp.profession}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          {isOwnProfile ? (
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBiodataModalOpen(true)}
                  className="px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition hover:bg-stone-50 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>View Printable Biodata</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Opening photo manager...', 'info')}
                  className="px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition hover:bg-stone-50 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <span>Manage Photos</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Redirecting to Edit Profile form...', 'info')}
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit My Profile</span>
                </button>
              </div>
            </div>
          ) : isBlocked ? (
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-600" /> This profile is blocked
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="detail-modal-btn-shortlist"
                  onClick={() => toggleShortlist(profile)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isShortlisted
                      ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-800 dark:text-amber-300'
                      : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current text-amber-600' : ''}`} />
                  <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                </button>

                {canMessage && (
                  <button
                    type="button"
                    id="detail-modal-btn-message"
                    onClick={() => { closeProfileDetail(); openChatWith(profile); }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                )}
              </div>

              {interestStatus === 'connected' ? (
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Connected</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => { closeProfileDetail(); openChatWith(profile); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Conversation</span>
                  </button>
                </div>
              ) : interestStatus === 'sent_pending' ? (
                <button
                  type="button"
                  disabled
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-300 cursor-default"
                >
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Interest Sent (Pending)</span>
                </button>
              ) : interestStatus === 'received_pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => interestRecord && acceptInterest(interestRecord.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
                  >
                    Accept Interest
                  </button>
                  <button
                    type="button"
                    onClick={() => interestRecord && declineInterest(interestRecord.id)}
                    className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="detail-modal-btn-interest"
                  onClick={() => sendInterest(profile)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-md cursor-pointer bg-gradient-to-r from-[#7A1C2E] via-[#8B1E34] to-[#991B33] hover:from-[#8B1E34] hover:to-[#B3203E] text-white hover:scale-[1.02] border border-amber-400/30"
                >
                  <Heart className="w-4 h-4 text-amber-200" />
                  <span>Send Interest (விருப்பம்)</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-70 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-2xl max-h-[80vh] flex items-center justify-center">
            <img
              src={currentPhoto}
              alt={profile.name}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {photoList.length > 1 && (
            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : photoList.length - 1))}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white text-xs font-semibold">
                {activePhotoIdx + 1} of {photoList.length}
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoIdx(prev => (prev < photoList.length - 1 ? prev + 1 : 0))}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Report Profile Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-[#7A1C2E] dark:text-amber-300 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> Report Profile ({profile.profileId})
              </h3>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Reason for Reporting
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Fake profile or impersonation">Fake profile or impersonation</option>
                  <option value="Inappropriate photos or content">Inappropriate photos or content</option>
                  <option value="Suspicious behavior or fraudulent activity">Suspicious behavior or fraudulent activity</option>
                  <option value="Harassment or unsolicited contact">Harassment or unsolicited contact</option>
                  <option value="Other concern">Other concern</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="Provide any additional context for our safety team..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Profile Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-base flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-600" /> Block Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsBlockModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to block <strong>{profile.name} ({profile.profileId})</strong>? You will no longer see this profile in searches or receive messages and interest requests from them.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsBlockModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockSubmit}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-black text-white font-bold transition"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Traditional Auspicious Kongu Biodata Modal */}
      {isBiodataModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white text-stone-900 rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto p-6 sm:p-8 space-y-6">
            {/* Header controls for Print & Close */}
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <KolamMotif size={20} color="#7A1C2E" />
                <span>Kongu Nila Matrimonial Biodata (வரன் சுயவிவரக் குறிப்பு)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gradient-to-r from-[#7A1C2E] to-[#991B33] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Biodata (அச்சிடுக)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBiodataModalOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Printable Traditional Bio-Data Sheet */}
            <div id="printable-matrimonial-biodata" className="space-y-6 text-xs sm:text-sm font-serif-brand">
              {/* Auspicious Invocation Header */}
              <div className="text-center space-y-1.5 border-b-2 border-amber-500/40 pb-4">
                <p className="text-amber-900 font-bold text-sm font-tamil">
                  ॥ ஸ்ரீ விநாயகர் துணை ॥ ஸ்ரீ முருகன் துணை ॥
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#7A1C2E] tracking-wide font-tamil">
                  கொங்கு வேளாளர் திருமண வரன் விவரக் குறிப்பு
                </h2>
                <p className="text-stone-600 text-xs font-mono">
                  Profile ID: <strong>{profile.profileId}</strong> • Registered on Kongu Nila Matrimony
                </p>
              </div>

              {/* Candidate Profile Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Photo */}
                <div className="sm:col-span-4 text-center space-y-2">
                  <div className="w-36 h-44 sm:w-44 sm:h-52 mx-auto rounded-xl overflow-hidden border-2 border-amber-600 shadow-md">
                    <img
                      src={photoList[0]}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    100% ID Verified Profile
                  </span>
                </div>

                {/* Candidate Core Info Table */}
                <div className="sm:col-span-8 space-y-2 text-stone-800">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil w-1/3">பெயர் (Name):</td>
                        <td className="py-1.5 font-bold text-stone-900">{profile.name}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">வயது & உயரம்:</td>
                        <td className="py-1.5">{profile.age} Yrs • {profile.height}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">பிறந்த தேதி & நேரம்:</td>
                        <td className="py-1.5">{profile.horoscope?.birthDate} • {profile.horoscope?.birthTime}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">ராசி & நட்சத்திரம்:</td>
                        <td className="py-1.5 font-tamil font-bold text-[#7A1C2E]">
                          {profile.horoscope?.rasi} • {profile.horoscope?.nakshatra} (பாதம் {profile.horoscope?.padam || 1})
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">கூட்டம் & கோத்திரம்:</td>
                        <td className="py-1.5 font-tamil font-bold text-amber-900">{profile.kootamGothram || profile.subCaste}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">குலதெய்வம்:</td>
                        <td className="py-1.5 font-tamil">{profile.kulaDeivam || 'Sellandi Amman / Bannari Mariamman'}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">கல்வி (Education):</td>
                        <td className="py-1.5 font-semibold">{profile.degree} ({profile.education})</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">பணி (Profession):</td>
                        <td className="py-1.5 font-semibold">{profile.profession} • {profile.company}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">வருமானம் (Income):</td>
                        <td className="py-1.5 font-mono">{profile.income}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-stone-600 font-tamil">பூர்வீகம் & இருப்பிடம்:</td>
                        <td className="py-1.5">{profile.nativePlace} ({profile.district}) • வசிப்பது: {profile.city}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Family Details Section in Biodata */}
              <div className="border-t border-amber-300 pt-4 space-y-2">
                <h4 className="font-bold text-[#7A1C2E] font-tamil text-sm">
                  குடும்ப விவரங்கள் (Family Particulars):
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs text-stone-800">
                  <p><strong>தந்தை பெயர் / தொழில்:</strong> {profile.fatherOccupation}</p>
                  <p><strong>தாய் பெயர் / தொழில்:</strong> {profile.motherOccupation}</p>
                  <p><strong>சகோதரர் (Brothers):</strong> {profile.brothersCount} ({profile.brothersMarried} Married)</p>
                  <p><strong>சகோதரி (Sisters):</strong> {profile.sistersCount} ({profile.sistersMarried} Married)</p>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-500">
                <span>Kongu Nila Matrimony Verified Record</span>
                <span>Contact: info@kongunilamatrimony.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
