import React from 'react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { KolamMotif } from '../common/KolamMotif';
import { X, Trash2, Heart, Check, Sparkles, User, Briefcase, GraduationCap, MapPin, Compass } from 'lucide-react';

export const ProfileComparisonModal: React.FC = () => {
  const {
    compareProfiles,
    removeFromCompare,
    clearCompare,
    openProfileDetail,
    sendInterest,
    interests
  } = useMatrimony();

  if (compareProfiles.length === 0) return null;

  return (
    <div
      id="profile-compare-tray"
      className="fixed bottom-16 lg:bottom-4 inset-x-4 max-w-5xl mx-auto z-40 bg-white/95 dark:bg-[#160A0D]/95 text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border-2 border-amber-400/80 p-4 backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-300"
    >
      {/* Compare Tray Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <KolamMotif size={20} color="#D4AF37" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Profile Comparison ({compareProfiles.length}/3 selected)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearCompare}
            className="text-xs text-stone-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="mt-3 overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-[500px]">
          {compareProfiles.map(profile => {
            const isInterestSent = interests.some(i => i.toProfileId === profile.id && i.fromProfileId === 'current_user');
            return (
              <div
                key={profile.id}
                className="relative bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 text-xs space-y-2 flex flex-col justify-between"
              >
                <button
                  onClick={() => removeFromCompare(profile.id)}
                  className="absolute top-2 right-2 p-1 text-stone-400 hover:text-rose-600 rounded-full bg-white dark:bg-stone-700 shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2.5">
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-12 h-14 rounded-lg object-cover border border-amber-400"
                  />
                  <div>
                    <h4
                      onClick={() => openProfileDetail(profile)}
                      className="font-bold text-stone-900 dark:text-stone-100 hover:underline cursor-pointer"
                    >
                      {profile.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {profile.age} Yrs • {profile.height.split('/')[0]}
                    </span>
                    <div className="text-amber-700 dark:text-amber-400 font-bold text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {profile.compatibility?.total || 90}% Match
                    </div>
                  </div>
                </div>

                {/* Attribute Specs */}
                <div className="space-y-1 pt-2 border-t border-stone-200 dark:border-stone-700 text-[11px]">
                  <p className="truncate"><strong>Profession:</strong> {profile.profession}</p>
                  <p className="truncate"><strong>Income:</strong> {profile.income}</p>
                  <p className="truncate"><strong>Education:</strong> {profile.degree}</p>
                  <p className="truncate"><strong>Kongu Kootam:</strong> {profile.kootamGothram || profile.subCaste}</p>
                  <p className="truncate"><strong>Native:</strong> {profile.nativePlace} ({profile.district})</p>
                  <p className="truncate font-tamil"><strong>Star:</strong> {profile.horoscope.nakshatra} ({profile.horoscope.rasi})</p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => openProfileDetail(profile)}
                    className="flex-1 py-1.5 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg font-bold text-[11px] hover:bg-stone-100 transition"
                  >
                    View Full
                  </button>
                  <button
                    onClick={() => sendInterest(profile)}
                    disabled={isInterestSent}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 ${
                      isInterestSent ? 'bg-emerald-600 text-white' : 'bg-[#7A1C2E] hover:bg-[#8E2136] text-white'
                    }`}
                  >
                    <Heart className="w-3 h-3" />
                    <span>{isInterestSent ? 'Sent' : 'Interest'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
