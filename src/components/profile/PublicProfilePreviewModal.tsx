import React, { useState } from 'react';
import { Profile } from '../../types';
import { KolamMotif } from '../common/KolamMotif';
import { CompatibilityBadge } from '../common/CompatibilityBadge';
import {
  X,
  Eye,
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
  Heart,
  Bookmark,
  MessageCircle,
  Clock,
  Home,
  Check
} from 'lucide-react';

interface PublicProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
}

export const PublicProfilePreviewModal: React.FC<PublicProfilePreviewModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'family' | 'horoscope' | 'preferences'>('about');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen) return null;

  const isPhotoBlurred = currentUser.photoPrivacy === 'on_request';
  const isHoroscopeHidden = currentUser.horoscopeHidden || currentUser.privacySettings?.horoscopeVisibility === 'on_request';
  const isContactLocked = currentUser.privacySettings?.hidePhoneNumber || currentUser.privacySettings?.contactAccessPreference !== 'anyone';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Preview Mode Top Banner */}
        <div className="bg-amber-500 text-stone-950 px-6 py-2.5 flex items-center justify-between text-xs font-bold shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-stone-950 animate-pulse" />
            <span>
              LIVE PROFILE PREVIEW — This is how other Kongu families see your profile
            </span>
          </div>
          <span className="text-[11px] bg-stone-950 text-amber-300 px-2 py-0.5 rounded-full font-mono">
            Privacy Active
          </span>
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <KolamMotif size={24} color="#F3E5AB" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif-brand tracking-wide text-amber-200">
                  {currentUser.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/40">
                  {currentUser.profileId}
                </span>
              </div>
              <p className="text-xs text-amber-100/80">
                {currentUser.age} Yrs • {currentUser.height} • {currentUser.city}, {currentUser.district}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Top Hero Grid: Photos & Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-50 dark:bg-stone-800/50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-700/60">
            {/* Left Photos */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 shadow-md">
                <img
                  src={currentUser.photos[activePhotoIdx] || currentUser.photos[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser.name}
                  className={`w-full h-full object-cover transition duration-300 ${
                    isPhotoBlurred ? 'filter blur-md scale-105' : ''
                  }`}
                />

                {isPhotoBlurred && (
                  <div className="absolute inset-0 bg-stone-950/60 flex flex-col items-center justify-center p-4 text-center text-white backdrop-blur-xs">
                    <Lock className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-xs font-bold">Photo Protected</p>
                    <p className="text-[10px] text-stone-300 mt-1">
                      Visible to families after interest is mutually accepted
                    </p>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {currentUser.isVerified && (
                    <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-white/20">
                      <ShieldCheck className="w-3 h-3" /> 100% Verified
                    </span>
                  )}
                  <span className="bg-amber-900/80 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-amber-400/30">
                    {currentUser.subCaste || currentUser.community}
                  </span>
                </div>
              </div>

              {/* Photo Thumbnails */}
              {currentUser.photos.length > 1 && !isPhotoBlurred && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {currentUser.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePhotoIdx(index)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activePhotoIdx === index ? 'border-amber-500 scale-105 shadow-sm' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Summary */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white font-serif-brand">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {currentUser.age} Yrs • {currentUser.height} • {currentUser.maritalStatus === 'never_married' ? 'Never Married' : currentUser.maritalStatus}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Profession</span>
                    <strong className="text-stone-800 dark:text-stone-200 truncate block">
                      {currentUser.profession}
                    </strong>
                    <span className="text-[10px] text-stone-500 truncate block">{currentUser.company}</span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Education</span>
                    <strong className="text-stone-800 dark:text-stone-200 truncate block">
                      {currentUser.degree || currentUser.education}
                    </strong>
                    <span className="text-[10px] text-stone-500 truncate block">{currentUser.college}</span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Native & Location</span>
                    <strong className="text-stone-800 dark:text-stone-200 truncate block">
                      {currentUser.nativePlace}
                    </strong>
                    <span className="text-[10px] text-stone-500 truncate block">Settled: {currentUser.city}</span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Kootam & Kula Deivam</span>
                    <strong className="text-stone-800 dark:text-stone-200 truncate block">
                      {currentUser.kootamGothram || 'Kongu Kootam'}
                    </strong>
                    <span className="text-[10px] text-stone-500 truncate block">{currentUser.kulaDeivam || 'Sellandi Amman'}</span>
                  </div>
                </div>

                {/* Protected Contact Box */}
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/20 rounded-xl border border-amber-300/60 dark:border-amber-500/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#7A1C2E] dark:text-amber-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      Contact Details
                    </span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-400 font-medium">
                      {isContactLocked ? 'Protected by Privacy' : 'Direct Contact Open'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                    {isContactLocked
                      ? 'Phone: +91 98422 ••••• (Hidden until request accepted)'
                      : `Phone: ${currentUser.phoneNumber || '+91 98422 12345'} • Email: ${currentUser.email}`}
                  </p>
                </div>
              </div>

              {/* Public Simulation Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  className="flex-1 py-2.5 bg-[#7A1C2E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm opacity-90 cursor-default"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Send Interest (Preview)</span>
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5 opacity-90 cursor-default"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Shortlist</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'about'
                  ? 'border-[#7A1C2E] text-[#7A1C2E] dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              About & Lifestyle
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'family'
                  ? 'border-[#7A1C2E] text-[#7A1C2E] dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Family & Lineage
            </button>
            <button
              onClick={() => setActiveTab('horoscope')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'horoscope'
                  ? 'border-[#7A1C2E] text-[#7A1C2E] dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Horoscope / Jathagam
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'border-[#7A1C2E] text-[#7A1C2E] dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Partner Expectations
            </button>
          </div>

          {/* Tab 1: About & Lifestyle */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white font-serif-brand">
                  About Me
                </h4>
                <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-700/60">
                  {currentUser.aboutMe || 'No description added yet.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <h5 className="font-bold text-stone-900 dark:text-white">Lifestyle & Diet</h5>
                  <div className="space-y-1.5 text-stone-600 dark:text-stone-300">
                    <p>• Food Preference: <strong className="capitalize">{currentUser.foodPreference}</strong></p>
                    <p>• Smoking: <strong>{currentUser.smoking ? 'Yes' : 'No'}</strong></p>
                    <p>• Drinking: <strong>{currentUser.drinking ? 'Yes' : 'No'}</strong></p>
                    <p>• Languages Known: <strong>{currentUser.languages?.join(', ') || currentUser.motherTongue}</strong></p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <h5 className="font-bold text-stone-900 dark:text-white">Hobbies & Interests</h5>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentUser.hobbies?.map((hobby, hIdx) => (
                      <span
                        key={hIdx}
                        className="px-2.5 py-1 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300 font-medium"
                      >
                        {hobby}
                      </span>
                    ))}
                    {currentUser.interests?.map((interest, iIdx) => (
                      <span
                        key={`int-${iIdx}`}
                        className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-300 font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Family & Lineage */}
          {activeTab === 'family' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white font-serif-brand">
                  About Our Family
                </h4>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {currentUser.aboutFamily || 'Respectable Kongu family.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <span className="text-[10px] text-stone-400 font-bold block">Father's Occupation</span>
                  <strong className="text-stone-800 dark:text-stone-200">{currentUser.fatherOccupation || 'Business'}</strong>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <span className="text-[10px] text-stone-400 font-bold block">Mother's Occupation</span>
                  <strong className="text-stone-800 dark:text-stone-200">{currentUser.motherOccupation || 'Homemaker'}</strong>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <span className="text-[10px] text-stone-400 font-bold block">Family Type & Values</span>
                  <strong className="text-stone-800 dark:text-stone-200 capitalize">
                    {currentUser.familyType} • {currentUser.familyValues}
                  </strong>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <span className="text-[10px] text-stone-400 font-bold block">Brothers</span>
                  <strong className="text-stone-800 dark:text-stone-200">
                    {currentUser.brothersCount} ({currentUser.brothersMarried} Married)
                  </strong>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <span className="text-[10px] text-stone-400 font-bold block">Sisters</span>
                  <strong className="text-stone-800 dark:text-stone-200">
                    {currentUser.sistersCount} ({currentUser.sistersMarried} Married)
                  </strong>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <span className="text-[10px] text-stone-400 font-bold block">Ancestral Native</span>
                  <strong className="text-stone-800 dark:text-stone-200">{currentUser.nativePlace}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Horoscope */}
          {activeTab === 'horoscope' && (
            <div className="space-y-4 text-xs">
              {isHoroscopeHidden ? (
                <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <Lock className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Horoscope Details Protected</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Based on your privacy setting, planetary houses & birth time are only revealed to families after you accept their interest.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Rasi (Moon Sign)</span>
                    <strong className="text-stone-800 dark:text-stone-200">{currentUser.horoscope.rasi}</strong>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Nakshatra (Star)</span>
                    <strong className="text-stone-800 dark:text-stone-200">{currentUser.horoscope.nakshatra} (Padam {currentUser.horoscope.padam || 1})</strong>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Lagnam</span>
                    <strong className="text-stone-800 dark:text-stone-200">{currentUser.horoscope.lagnam || 'Mesham'}</strong>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Birth Date & Time</span>
                    <strong className="text-stone-800 dark:text-stone-200">{currentUser.horoscope.birthDate} • {currentUser.horoscope.birthTime}</strong>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Birth Place</span>
                    <strong className="text-stone-800 dark:text-stone-200">{currentUser.horoscope.birthPlace}</strong>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 font-bold block">Dosham Status</span>
                    <strong className="text-stone-800 dark:text-stone-200 capitalize">
                      {currentUser.horoscope.dosham === 'no_dosham' ? 'Suddha Jathagam (No Dosham)' : currentUser.horoscope.dosham.replace('_', ' ')}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Partner Expectations */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">Expected Age & Height</span>
                  <p className="text-stone-800 dark:text-stone-200 font-semibold">
                    {currentUser.partnerPreferences?.ageRange[0] || 22} to {currentUser.partnerPreferences?.ageRange[1] || 28} Yrs • 5' 2" to 5' 8"
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">Preferred Locations</span>
                  <p className="text-stone-800 dark:text-stone-200 font-semibold">
                    {currentUser.partnerPreferences?.locations?.join(', ') || 'Coimbatore, Erode, Tiruppur, Chennai'}
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">Education & Profession</span>
                  <p className="text-stone-800 dark:text-stone-200 font-semibold">
                    {currentUser.partnerPreferences?.educationLevels?.join(', ') || 'B.E./B.Tech, MS Abroad, MBBS, CA'}
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">Community & Food</span>
                  <p className="text-stone-800 dark:text-stone-200 font-semibold">
                    {currentUser.partnerPreferences?.communities?.join(', ') || 'Kongu Vellalar'} • {currentUser.partnerPreferences?.foodPreference?.join(' / ') || 'Vegetarian / Non-Vegetarian'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 dark:bg-stone-850 px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500">
            Previewing: {currentUser.name} ({currentUser.profileId})
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#7A1C2E] hover:bg-[#5C1020] text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Back to Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};
