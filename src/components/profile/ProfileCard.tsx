import React, { useState, useMemo } from 'react';
import { Profile } from '../../types';
import { useMatrimony } from '../../context/MatrimonyContext';
import { useAuth } from '../../context/AuthContext';
import { calculateCompatibility } from '../../services/matchingService';
import {
  Heart,
  Bookmark,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Compass,
  ChevronRight,
  Eye,
  Crown,
  CheckCircle2,
  HelpCircle,
  X,
  UserCheck,
  Building2,
  Home,
  Lock,
  Clock,
  Edit3,
  MessageCircle,
  Check,
  Ban
} from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  compact?: boolean;
  layout?: 'grid' | 'list';
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, compact = false, layout = 'grid' }) => {
  const {
    toggleShortlist,
    sendInterest,
    acceptInterest,
    declineInterest,
    openProfileDetail,
    openChatWith,
    getRelationshipStatus,
    viewMode
  } = useMatrimony();

  const { currentUser } = useAuth();

  const [showMatchBreakdown, setShowMatchBreakdown] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOwnProfile = Boolean(currentUser && (currentUser.id === profile.id || currentUser.profileId === profile.profileId));
  const relationship = getRelationshipStatus(profile.id);
  const { isShortlisted, interestStatus, interestRecord, isBlocked, canMessage } = relationship;

  const isPhotoPrivate = profile.photoPrivacy === 'on_request' || profile.avatarBlur;

  const fallbackPhoto = profile.gender === 'female'
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';

  const mainPhoto = imgError ? fallbackPhoto : (profile.photos?.[0] || fallbackPhoto);

  const compatibility = useMemo(() => {
    if (profile.compatibility) return profile.compatibility;
    return calculateCompatibility(currentUser, profile);
  }, [currentUser, profile]);

  const compatibilityScore = compatibility.total;

  // Key match reasons derived from profile attributes
  const matchReasons = compatibility.reasons && compatibility.reasons.length > 0
    ? compatibility.reasons
    : [
        'Congruent educational qualification and career track',
        'Kongu cultural alignment and family values',
        'Western Tamil Nadu native regional proximity'
      ];

  // List View Layout
  if (layout === 'list') {
    return (
      <div
        id={`profile-card-list-${profile.id}`}
        className="group relative bg-white dark:bg-[#1A0F12] rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 hover:border-amber-500/50 dark:hover:border-amber-400/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Photo Container */}
        <div className="relative w-full md:w-56 h-64 md:h-auto shrink-0 bg-stone-100 dark:bg-stone-800 overflow-hidden">
          {isPhotoPrivate ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-800 p-4 text-center border border-dashed border-amber-300 dark:border-stone-700">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-stone-700 flex items-center justify-center text-amber-800 dark:text-amber-300 mb-2 shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 leading-tight">
                Photo available after connection
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                Privacy Protected
              </span>
            </div>
          ) : (
            <img
              src={mainPhoto}
              alt={`${profile.name} - ${profile.profileId}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {profile.isOnline ? (
              <span className="inline-flex items-center gap-1 bg-stone-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Now
              </span>
            ) : profile.lastActive ? (
              <span className="inline-flex items-center gap-1 bg-stone-950/70 backdrop-blur-md text-stone-300 text-[9px] font-medium px-2 py-0.5 rounded-full">
                <Clock className="w-2.5 h-2.5 text-stone-400" />
                Active {profile.lastActive}
              </span>
            ) : null}

            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 bg-emerald-700/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs border border-emerald-400/30" title="100% Govt ID & Photo Verified">
                <ShieldCheck className="w-3 h-3 text-emerald-200" />
                <span>✓ Verified</span>
              </span>
            )}
          </div>

          {/* Overlay Click Button */}
          <button
            type="button"
            onClick={() => openProfileDetail(profile)}
            className="absolute inset-0 bg-[#7A1C2E]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1.5 transition-opacity duration-200 cursor-pointer"
          >
            <Eye className="w-4 h-4" /> View Full Profile
          </button>
        </div>

        {/* Right Info Section */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Header: Name, Age, ID, Match Score */}
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800/80">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    onClick={() => openProfileDetail(profile)}
                    className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100 hover:text-[#7A1C2E] dark:hover:text-amber-300 cursor-pointer transition"
                  >
                    {profile.name}
                  </h3>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    ({profile.age} yrs, {profile.height.split('/')[0].trim()})
                  </span>
                  {profile.isVerified && (
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold" title="100% ID Verified Profile">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Verified</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                  ID: <strong className="text-stone-700 dark:text-stone-300">{profile.profileId}</strong> • Native: <strong className="text-stone-700 dark:text-stone-300">{profile.nativePlace}</strong>
                </p>
              </div>

              {/* Match Score & Why button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-300 rounded-full border border-amber-300/80 dark:border-amber-500/30 text-xs font-bold font-serif-brand shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{compatibilityScore}% Match</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMatchBreakdown(!showMatchBreakdown)}
                  className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition cursor-pointer"
                  title="Why this match?"
                >
                  <HelpCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 opacity-80" />
                </button>
              </div>
            </div>

            {/* Match Breakdown Popover */}
            {showMatchBreakdown && (
              <div className="mt-3 p-3.5 bg-amber-50/95 dark:bg-stone-900 rounded-xl border border-amber-300/80 dark:border-amber-500/30 text-xs space-y-2.5 animate-in fade-in duration-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#7A1C2E] dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Why this match? (Compatibility Analysis)
                  </span>
                  <button onClick={() => setShowMatchBreakdown(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700 dark:text-stone-300">
                  {matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason.replace(/^✓\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Core Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mt-3.5 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                <span className="truncate">
                  <span className="font-medium text-stone-900 dark:text-stone-100">{profile.profession}</span> • {profile.income}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                <span className="truncate">{profile.education}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                <span className="truncate">{profile.city}, {profile.district}</span>
              </div>

              <div className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                <span className="truncate font-semibold text-amber-900 dark:text-amber-300">
                  {profile.kootamGothram || profile.subCaste || profile.community}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                <span className="truncate font-tamil text-[11px]">
                  {profile.horoscope?.rasi} • {profile.horoscope?.nakshatra}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                <span className="truncate capitalize">{profile.familyStatus?.replace(/_/g, ' ')} ({profile.familyType})</span>
              </div>
            </div>

            {/* About Snippet */}
            {profile.aboutMe && (
              <p className="mt-3 text-xs text-stone-600 dark:text-stone-400 line-clamp-2 italic bg-[#FAF7F2] dark:bg-stone-900/50 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800">
                "{profile.aboutMe}"
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-3 mt-3 border-t border-[#EFE6DA] dark:border-stone-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => openProfileDetail(profile)}
              className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:text-rose-800 dark:hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
            >
              <span>View Full Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => openProfileDetail(profile)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 transition cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>
              ) : isBlocked ? (
                <span className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 text-xs font-bold flex items-center gap-1">
                  <Ban className="w-3.5 h-3.5" /> Blocked
                </span>
              ) : (
                <>
                  {/* Shortlist Button */}
                  <button
                    type="button"
                    id={`btn-shortlist-list-${profile.id}`}
                    onClick={() => toggleShortlist(profile)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isShortlisted
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                        : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                    title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current text-amber-600' : ''}`} />
                    <span className="hidden sm:inline">{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>

                  {/* Relationship Interest Actions */}
                  {interestStatus === 'connected' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-300/40">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                      <button
                        type="button"
                        onClick={() => openChatWith(profile)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    </div>
                  ) : interestStatus === 'sent_pending' ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Interest Sent
                    </span>
                  ) : interestStatus === 'received_pending' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => interestRecord && acceptInterest(interestRecord.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => interestRecord && declineInterest(interestRecord.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold transition hover:bg-stone-200 cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id={`btn-interest-list-${profile.id}`}
                      onClick={() => sendInterest(profile)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer bg-gradient-to-r from-[#7A1C2E] via-[#8B1E34] to-[#991B33] hover:from-[#8B1E34] hover:to-[#B3203E] text-white shadow-md hover:scale-[1.02] border border-amber-400/30"
                    >
                      <Heart className="w-3.5 h-3.5 text-amber-200" />
                      <span>Send Interest</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout
  return (
    <div
      id={`profile-card-grid-${profile.id}`}
      className="group relative bg-white dark:bg-[#1A0F12] rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 hover:border-amber-500/50 dark:hover:border-amber-400/40 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Header & Photo Banner */}
        <div className="relative w-full h-72 sm:h-80 bg-stone-100 dark:bg-stone-800 overflow-hidden">
          {isPhotoPrivate ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 dark:bg-stone-800 border-b border-dashed border-amber-300 dark:border-stone-700">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-700 flex items-center justify-center text-amber-800 dark:text-amber-300 mb-3 shadow-2xs">
                <Lock className="w-6 h-6" />
              </div>
              <strong className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Photo visible after mutual interest
              </strong>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 max-w-[200px]">
                Photo privacy protected by family preference
              </p>
            </div>
          ) : (
            <img
              src={mainPhoto}
              alt={`${profile.name} - ${profile.profileId}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              {profile.isOnline ? (
                <span className="inline-flex items-center gap-1 bg-stone-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-semibold px-2.5 py-0.8 rounded-full border border-emerald-500/30 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              ) : profile.lastActive ? (
                <span className="inline-flex items-center gap-1 bg-stone-950/70 backdrop-blur-md text-stone-300 text-[9px] font-medium px-2.5 py-0.8 rounded-full">
                  <Clock className="w-2.5 h-2.5 text-stone-400" />
                  {profile.lastActive}
                </span>
              ) : null}

              {profile.isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-700/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs border border-emerald-400/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-200" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {/* Compatibility Badge Top Right */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-stone-950/80 backdrop-blur-md rounded-full border border-amber-400/50 text-amber-300 text-xs font-bold font-serif-brand shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{compatibilityScore}%</span>
            </div>
          </div>

          {/* Bottom Card Title over Photo */}
          <div className="absolute bottom-3 left-3 right-3 text-white z-10">
            <div className="flex items-center justify-between gap-2">
              <h3
                onClick={() => openProfileDetail(profile)}
                className="text-lg font-bold font-serif-brand text-amber-100 hover:text-amber-300 cursor-pointer transition drop-shadow-sm truncate"
              >
                {profile.name}
              </h3>
              <span className="text-xs text-stone-300 shrink-0 font-medium">
                {profile.age} yrs • {profile.height.split('/')[0].trim()}
              </span>
            </div>
            <p className="text-[11px] text-amber-200/90 font-mono">
              ID: {profile.profileId} • Native: {profile.nativePlace}
            </p>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-3 text-xs">
          {/* Attributes List */}
          <div className="space-y-2 text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
              <span className="truncate">
                <strong className="font-semibold text-stone-900 dark:text-stone-100">{profile.profession}</strong> ({profile.company})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
              <span className="truncate">{profile.degree || profile.education}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
              <span className="truncate">{profile.city}, {profile.district}</span>
            </div>

            <div className="flex items-center gap-2">
              <Home className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
              <span className="truncate font-semibold text-amber-900 dark:text-amber-300">
                {profile.kootamGothram || profile.subCaste}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
              <span className="truncate font-tamil text-[11px]">
                {profile.horoscope?.rasi} • {profile.horoscope?.nakshatra}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="px-4 py-3 bg-[#FAF7F2]/90 dark:bg-stone-900/80 border-t border-[#EFE6DA] dark:border-stone-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => openProfileDetail(profile)}
          className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:text-rose-800 dark:hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
        >
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {isOwnProfile ? (
            <button
              type="button"
              onClick={() => openProfileDetail(profile)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : isBlocked ? (
            <span className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 text-xs font-bold flex items-center gap-1">
              <Ban className="w-3.5 h-3.5" /> Blocked
            </span>
          ) : (
            <>
              {/* Shortlist Button */}
              <button
                type="button"
                id={`btn-shortlist-${profile.id}`}
                onClick={() => toggleShortlist(profile)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isShortlisted
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current text-amber-600' : ''}`} />
                <span className="hidden sm:inline">{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
              </button>

              {/* Relationship Interest Actions */}
              {interestStatus === 'connected' ? (
                <button
                  type="button"
                  onClick={() => openChatWith(profile)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              ) : interestStatus === 'sent_pending' ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Sent
                </span>
              ) : interestStatus === 'received_pending' ? (
                <button
                  type="button"
                  onClick={() => interestRecord && acceptInterest(interestRecord.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Accept
                </button>
              ) : (
                <button
                  type="button"
                  id={`btn-interest-${profile.id}`}
                  onClick={() => sendInterest(profile)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer bg-gradient-to-r from-[#7A1C2E] via-[#8B1E34] to-[#991B33] hover:from-[#8B1E34] hover:to-[#B3203E] text-white shadow-md hover:scale-[1.02] border border-amber-400/30"
                >
                  <Heart className="w-3.5 h-3.5 text-amber-200" />
                  <span>Interest</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
