import React, { useState, useMemo } from 'react';
import { useMatrimony } from '../context/MatrimonyContext';
import { useLanguage } from '../context/LanguageContext';
import { KolamMotif } from '../components/common/KolamMotif';
import { Profile, InterestRecord } from '../types';
import {
  Heart,
  Check,
  X,
  MessageCircle,
  Clock,
  ShieldCheck,
  User,
  Search,
  Sparkles,
  Compass,
  ArrowRight,
  Eye,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Home,
  Utensils
} from 'lucide-react';

interface InterestsViewProps {
  setCurrentTab?: (tab: string) => void;
}

type MainTab = 'received' | 'sent' | 'connected';
type SubFilter = 'all' | 'pending' | 'accepted' | 'declined' | 'withdrawn';

export const InterestsView: React.FC<InterestsViewProps> = ({ setCurrentTab }) => {
  const {
    interests,
    profiles,
    shortlists,
    toggleShortlist,
    acceptInterest,
    declineInterest,
    withdrawInterest,
    openProfileDetail,
    openChatWith
  } = useMatrimony();

  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<MainTab>('received');
  const [subFilter, setSubFilter] = useState<SubFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Confirmation Modals State
  const [declineTargetId, setDeclineTargetId] = useState<string | null>(null);
  const [withdrawTargetId, setWithdrawTargetId] = useState<string | null>(null);

  // Filtered lists
  const receivedInterests = useMemo(() => {
    return interests.filter(i => i.toProfileId === 'current_user');
  }, [interests]);

  const sentInterests = useMemo(() => {
    return interests.filter(i => i.fromProfileId === 'current_user');
  }, [interests]);

  const connectedInterests = useMemo(() => {
    return interests.filter(i => i.status === 'accepted');
  }, [interests]);

  const pendingReceivedCount = useMemo(() => {
    return receivedInterests.filter(i => i.status === 'pending').length;
  }, [receivedInterests]);

  const currentList = useMemo(() => {
    let list: InterestRecord[] = [];

    if (activeTab === 'received') {
      list = [...receivedInterests];
    } else if (activeTab === 'sent') {
      list = [...sentInterests];
    } else if (activeTab === 'connected') {
      list = [...connectedInterests];
    }

    // Apply SubFilter
    if (subFilter !== 'all') {
      list = list.filter(i => i.status === subFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        const partnerProfile =
          activeTab === 'received'
            ? profiles.find(p => p.id === item.fromProfileId) || item.profile
            : profiles.find(p => p.id === item.toProfileId) || item.profile;

        if (!partnerProfile) return false;
        return (
          partnerProfile.name.toLowerCase().includes(q) ||
          partnerProfile.profileId.toLowerCase().includes(q) ||
          partnerProfile.city.toLowerCase().includes(q) ||
          partnerProfile.profession.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [activeTab, subFilter, searchQuery, receivedInterests, sentInterests, connectedInterests, profiles]);

  const handleConfirmDecline = () => {
    if (declineTargetId) {
      declineInterest(declineTargetId);
      setDeclineTargetId(null);
    }
  };

  const handleConfirmWithdraw = () => {
    if (withdrawTargetId) {
      withdrawInterest(withdrawTargetId);
      setWithdrawTargetId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-xl space-y-3">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-kolam-pattern" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
            <KolamMotif size={16} color="#F3E5AB" />
            <span>Matrimonial Engagement Hub</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-200">
            <span>
              Connected:{' '}
              <strong className="text-white bg-emerald-700/80 px-2 py-0.5 rounded-full border border-emerald-400/40">
                {connectedInterests.length} Profiles
              </strong>
            </span>
          </div>
        </div>

        <div className="relative space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-brand text-amber-100 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
            <span>Matrimonial Interests</span>
            <span className="text-sm sm:text-base font-normal font-sans text-amber-200">
              (விருப்பங்கள்)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90">
            Track expressions of interest you have received, sent, and actively connected with.
          </p>
          <p className="text-xs text-amber-300/80 font-tamil">
            உங்களுக்கு வந்த மற்றும் நீங்கள் அனுப்பிய வரன் விருப்பங்களின் நேரலை விவரம்.
          </p>
        </div>
      </div>

      {/* 2. Main Navigation Tabs */}
      <div className="bg-white dark:bg-[#1A0F12] p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Main Category Tabs */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl text-xs font-bold shrink-0 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setActiveTab('received');
                setSubFilter('all');
              }}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'received'
                  ? 'bg-[#7A1C2E] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>Received Interests</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'received'
                    ? 'bg-black/30 text-amber-200'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {receivedInterests.length}
              </span>
              {pendingReceivedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('sent');
                setSubFilter('all');
              }}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'sent'
                  ? 'bg-[#7A1C2E] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>Sent Interests</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'sent'
                    ? 'bg-black/30 text-amber-200'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {sentInterests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('connected');
                setSubFilter('all');
              }}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'connected'
                  ? 'bg-[#7A1C2E] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Connected ({connectedInterests.length})</span>
            </button>
          </div>

          {/* Quick Search in Interests */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, location..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Sub-Filters Pill Row */}
        {activeTab !== 'connected' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs font-semibold">
            <span className="text-stone-500 dark:text-stone-400 text-[11px]">Filter by Status:</span>
            <button
              onClick={() => setSubFilter('all')}
              className={`px-3 py-1 rounded-lg transition border cursor-pointer ${
                subFilter === 'all'
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-300'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSubFilter('pending')}
              className={`px-3 py-1 rounded-lg transition border cursor-pointer ${
                subFilter === 'pending'
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-300'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              Pending Response
            </button>
            <button
              onClick={() => setSubFilter('accepted')}
              className={`px-3 py-1 rounded-lg transition border cursor-pointer ${
                subFilter === 'accepted'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-300'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              Accepted / Connected
            </button>
            <button
              onClick={() => setSubFilter('declined')}
              className={`px-3 py-1 rounded-lg transition border cursor-pointer ${
                subFilter === 'declined'
                  ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-300'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              Declined
            </button>
            {activeTab === 'sent' && (
              <button
                onClick={() => setSubFilter('withdrawn')}
                className={`px-3 py-1 rounded-lg transition border cursor-pointer ${
                  subFilter === 'withdrawn'
                    ? 'bg-stone-200 dark:bg-stone-700 border-stone-400 text-stone-800 dark:text-stone-200'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                Withdrawn
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Interests List or Empty State */}
      <div className="space-y-4">
        {currentList.length > 0 ? (
          currentList.map(interest => {
            const isReceived = interest.toProfileId === 'current_user';
            const partnerProfile = isReceived
              ? profiles.find(p => p.id === interest.fromProfileId) || interest.profile
              : profiles.find(p => p.id === interest.toProfileId) || interest.profile;

            if (!partnerProfile) return null;

            const isShortlisted = shortlists.some(s => s.profileId === partnerProfile.id);
            const score = partnerProfile.compatibility?.total || 90;

            const fallbackPhoto = partnerProfile.gender === 'female'
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

            const photo = partnerProfile.photos?.[0] || fallbackPhoto;

            return (
              <div
                key={interest.id}
                id={`interest-card-${interest.id}`}
                className="bg-white dark:bg-[#1A0F12] p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 hover:border-amber-400/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left Profile Section */}
                <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                  <div
                    onClick={() => openProfileDetail(partnerProfile)}
                    className="relative w-20 h-24 sm:w-22 sm:h-26 rounded-2xl overflow-hidden shrink-0 border border-amber-400/40 shadow-xs cursor-pointer group"
                  >
                    <img
                      src={photo}
                      alt={partnerProfile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {partnerProfile.isVerified && (
                      <span className="absolute bottom-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full" title="Verified Profile">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => openProfileDetail(partnerProfile)}
                        className="font-bold text-base sm:text-lg font-serif-brand text-stone-900 dark:text-amber-100 hover:text-[#7A1C2E] dark:hover:text-amber-300 cursor-pointer transition"
                      >
                        {partnerProfile.name}
                      </h3>
                      <span className="text-xs text-stone-500 font-medium">
                        ({partnerProfile.age} Yrs, {partnerProfile.height?.split('/')[0].trim()})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {partnerProfile.profileId}
                      </span>
                    </div>

                    <p className="text-xs text-amber-900 dark:text-amber-400 font-semibold">
                      {partnerProfile.profession} • {partnerProfile.community} ({partnerProfile.kootamGothram || partnerProfile.subCaste})
                    </p>

                    <p className="text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{partnerProfile.city}, {partnerProfile.district}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>{score}% Compatibility</span>
                      </span>
                    </p>

                    {/* Sent/Received Timestamp & Custom Message */}
                    <div className="pt-1 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>
                        {isReceived ? 'Received' : 'Sent'} on {interest.sentAt}
                      </span>
                    </div>

                    {interest.message && (
                      <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-300 italic bg-[#FAF7F2] dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-800 max-w-lg">
                        "{interest.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Status & Action Section */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-end lg:items-center gap-2.5 w-full md:w-auto shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                  {/* Status Badge */}
                  <div>
                    {interest.status === 'accepted' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300/60 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </span>
                    ) : interest.status === 'declined' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-300/60">
                        <X className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    ) : interest.status === 'withdrawn' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Withdrawn</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-300/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isReceived ? 'Awaiting Your Response' : 'Pending Response'}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions for Received Interests */}
                  {isReceived && interest.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDeclineTargetId(interest.id)}
                        className="px-3.5 py-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 text-stone-500" />
                        <span>Decline</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => acceptInterest(interest.id)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:scale-105 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Interest</span>
                      </button>
                    </div>
                  )}

                  {/* Actions for Sent Interests in Pending state */}
                  {!isReceived && interest.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWithdrawTargetId(interest.id)}
                        className="px-3.5 py-2 border border-stone-300 dark:border-stone-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-600 dark:text-stone-400 hover:text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openProfileDetail(partnerProfile)}
                        className="px-3.5 py-2 bg-[#7A1C2E] hover:bg-[#8B1E34] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>
                    </div>
                  )}

                  {/* Actions for Accepted / Connected */}
                  {interest.status === 'accepted' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openChatWith(partnerProfile)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:scale-105 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Start Conversation</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openProfileDetail(partnerProfile)}
                        className="p-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl transition cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Actions for Declined / Withdrawn */}
                  {(interest.status === 'declined' || interest.status === 'withdrawn') && (
                    <button
                      type="button"
                      onClick={() => openProfileDetail(partnerProfile)}
                      className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Empty States based on Active Tab */
          <div className="p-10 sm:p-16 text-center bg-white dark:bg-[#1A0F12] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mx-auto text-[#7A1C2E] dark:text-amber-400">
              <Heart className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
                {activeTab === 'received'
                  ? 'No New Interests'
                  : activeTab === 'sent'
                  ? 'No Interests Sent Yet'
                  : 'No Connected Profiles Yet'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                {activeTab === 'received'
                  ? "When someone expresses interest in your profile, you'll see their full biodata here."
                  : activeTab === 'sent'
                  ? 'Explore profiles and express interest when you find someone suitable for matrimonial alliance.'
                  : 'When an interest is mutually accepted, you will be connected and can start meaningful family conversations.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {activeTab === 'received' && (
                <button
                  type="button"
                  onClick={() => {
                    if (setCurrentTab) setCurrentTab('my-profile');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Improve Your Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {activeTab === 'sent' && (
                <button
                  type="button"
                  onClick={() => {
                    if (setCurrentTab) setCurrentTab('search');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Profiles</span>
                </button>
              )}

              {activeTab === 'connected' && (
                <button
                  type="button"
                  onClick={() => {
                    if (setCurrentTab) setCurrentTab('matches');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Matches</span>
                </button>
              )}

              {subFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSubFilter('all')}
                  className="px-4 py-2.5 text-xs text-amber-800 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Decline Interest Confirmation Dialog Modal */}
      {declineTargetId && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setDeclineTargetId(null)}
        >
          <div
            className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-stone-100">
                Decline this interest?
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                The sender profile will not be notified with unnecessary details. You can always view this profile again in search.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeclineTargetId(null)}
                className="flex-1 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Withdraw Interest Confirmation Dialog Modal */}
      {withdrawTargetId && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setWithdrawTargetId(null)}
        >
          <div
            className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-stone-100">
                Withdraw this interest?
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Are you sure you want to cancel your interest request sent to this prospective match?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWithdrawTargetId(null)}
                className="flex-1 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                Keep Pending
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                className="flex-1 py-2.5 bg-[#7A1C2E] hover:bg-[#8B1E34] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
