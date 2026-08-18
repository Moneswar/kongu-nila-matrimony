import React, { useEffect, useMemo } from 'react';
import { Profile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { calculateCompatibility } from '../../services/matchingService';
import { KolamMotif } from '../common/KolamMotif';
import {
  X,
  Sparkles,
  CheckCircle2,
  Heart,
  Bookmark,
  Eye,
  ShieldCheck,
  MapPin,
  GraduationCap,
  Briefcase,
  Compass,
  Home,
  Users,
  Utensils,
  ChevronRight,
  Info
} from 'lucide-react';

interface WhyThisMatchModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  onToggleShortlist: (profile: Profile) => void;
  isShortlisted: boolean;
  isInterestSent: boolean;
}

export const WhyThisMatchModal: React.FC<WhyThisMatchModalProps> = ({
  profile,
  isOpen,
  onClose,
  onViewProfile,
  onSendInterest,
  onToggleShortlist,
  isShortlisted,
  isInterestSent,
}) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const compatibility = useMemo(() => {
    if (!profile) return null;
    return calculateCompatibility(currentUser, profile);
  }, [currentUser, profile]);

  if (!isOpen || !profile || !compatibility) return null;

  const score = compatibility.total;

  const fallbackPhoto = profile.gender === 'female'
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';

  const photo = profile.photos?.[0] || fallbackPhoto;

  const breakdownMetrics = [
    { label: 'Partner Preferences', score: compatibility.partnerPreference, color: 'bg-emerald-500' },
    { label: 'Location & Native Belt', score: compatibility.location, color: 'bg-sky-500' },
    { label: 'Education Compatibility', score: compatibility.education, color: 'bg-rose-500' },
    { label: 'Career & Income Standing', score: compatibility.career || 90, color: 'bg-amber-500' },
    { label: 'Lifestyle & Dietary Habits', score: compatibility.lifestyle, color: 'bg-teal-500' },
    { label: 'Family Structure & Values', score: compatibility.family || 90, color: 'bg-purple-500' },
    { label: 'Kongu Lineage & Cultural', score: compatibility.cultural || 90, color: 'bg-amber-600' },
  ];

  return (
    <div
      id="why-this-match-modal"
      className="fixed inset-0 z-60 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white px-5 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <KolamMotif size={22} color="#F3E5AB" />
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-brand tracking-wide text-amber-200 flex items-center gap-2">
                <span>Why This Match?</span>
                <span className="text-xs font-tamil font-normal text-amber-100/90">(பொருத்த விவரம்)</span>
              </h2>
              <p className="text-[11px] text-amber-100/80">
                Detailed compatibility assessment derived from your profile & partner preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Candidate Profile Summary Header */}
          <div className="p-4 bg-stone-50 dark:bg-[#140C0E] rounded-2xl border border-stone-200 dark:border-amber-500/20 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border-2 border-amber-500/30 shadow-sm bg-stone-200 dark:bg-stone-800">
              <img
                src={photo}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              {profile.isVerified && (
                <span className="absolute bottom-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs" title="Verified Profile">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  {profile.name}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-amber-950/60 text-stone-700 dark:text-amber-300 border border-stone-300 dark:border-amber-500/30">
                  {profile.profileId}
                </span>
              </div>

              <p className="text-stone-600 dark:text-stone-300 text-xs">
                {profile.age} Yrs • {profile.height.split('/')[0].trim()} • {profile.profession}
              </p>

              <p className="text-amber-900 dark:text-amber-300 font-semibold text-[11px]">
                {profile.community} • {profile.kootamGothram || profile.subCaste} • Native: {profile.nativePlace} ({profile.district})
              </p>
            </div>

            {/* Overall Compatibility Score Badge */}
            <div className="text-center bg-white dark:bg-[#1A0F12] p-3 rounded-2xl border border-amber-400/40 shadow-xs shrink-0 min-w-[110px]">
              <div className="flex items-center justify-center gap-1 text-[#7A1C2E] dark:text-amber-300 font-bold text-xl font-serif-brand">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{score}%</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mt-0.5">
                {score >= 88 ? 'High Match' : 'Good Match'}
              </span>
            </div>
          </div>

          {/* Metric Breakdown Progress Bars */}
          <div className="space-y-3 p-4 bg-white dark:bg-[#140C0E] rounded-2xl border border-stone-200/80 dark:border-amber-500/20">
            <h4 className="text-xs font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center justify-between">
              <span>Weighted Compatibility Dimensions</span>
              <span className="text-[10px] font-normal text-stone-500 dark:text-stone-400">Calculated from actual data</span>
            </h4>

            <div className="space-y-2.5 pt-1">
              {breakdownMetrics.map((metric, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-700 dark:text-stone-300 font-medium">{metric.label}</span>
                    <span className="font-bold text-stone-900 dark:text-amber-200">{metric.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Matching Factors Checklist */}
          {compatibility.reasons && compatibility.reasons.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Match Drivers (பொருத்தக் காரணங்கள்):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {compatibility.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-amber-500/20 text-[11px] text-stone-700 dark:text-stone-300 leading-snug flex items-start gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{reason.replace(/^✓\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cultural & Family Guidance Note */}
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-300/80 dark:border-amber-500/30 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed font-tamil">
              <strong>குடும்ப வழிகாட்டுதல் குறிப்பு:</strong> பொருத்தப் புள்ளிகள் உங்களின் துணை எதிர்பார்ப்புகள், சொந்த ஊர் மற்றும் கொங்கு சமுதாய மரபுகளின் அடிப்படையில் கணக்கிடப்பட்டுள்ளது. இறுதி முடிவுக்கு முன் குடும்பப் பெரியவர்கள் மற்றும் குடும்ப ஜோதிடருடன் கலந்து ஆலோசிக்கவும்.
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 bg-stone-50 dark:bg-[#140C0E] border-t border-stone-200 dark:border-amber-500/20 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleShortlist(profile)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isShortlisted
                  ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-800 dark:text-amber-300'
                  : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current text-amber-600' : ''}`} />
              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewProfile(profile);
              }}
              className="px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>View Profile</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSendInterest(profile)}
            disabled={isInterestSent}
            className={`px-5 py-2.5 btn-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer ${
              isInterestSent ? 'opacity-80 cursor-default' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isInterestSent ? 'fill-current text-white' : 'text-amber-200'}`} />
            <span>{isInterestSent ? 'Interest Sent' : 'Send Interest (விருப்பம்)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
