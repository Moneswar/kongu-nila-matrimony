import React, { useState, useMemo } from 'react';
import { useMatrimony } from '../context/MatrimonyContext';
import { ProfileCard } from '../components/profile/ProfileCard';
import { KolamMotif } from '../components/common/KolamMotif';
import {
  Bookmark,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Lock,
  Sparkles,
  ShieldCheck,
  MapPin,
  Compass,
  RotateCcw,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface ShortlistsViewProps {
  setCurrentTab: (tab: string) => void;
}

export const ShortlistsView: React.FC<ShortlistsViewProps> = ({ setCurrentTab }) => {
  const { shortlists, profiles } = useMatrimony();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'compatible' | 'kongu' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<'recently_added' | 'compatibility' | 'age_asc' | 'age_desc'>('recently_added');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Derive shortlisted profiles matching active shortlist records
  const shortlistedProfiles = useMemo(() => {
    // Map shortlist records to profiles
    const list = shortlists
      .map(record => {
        const found = profiles.find(p => p.id === record.profileId);
        return {
          profile: found || record.profile,
          record
        };
      })
      .filter(item => Boolean(item.profile));

    // Filter by search query (Name, ID, city, profession, degree, kootam)
    let filtered = list.filter(({ profile }) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        profile.name.toLowerCase().includes(q) ||
        profile.profileId.toLowerCase().includes(q) ||
        profile.city.toLowerCase().includes(q) ||
        profile.district.toLowerCase().includes(q) ||
        profile.profession.toLowerCase().includes(q) ||
        profile.degree.toLowerCase().includes(q) ||
        (profile.kootamGothram && profile.kootamGothram.toLowerCase().includes(q))
      );
    });

    // Filter by type
    if (filterType === 'compatible') {
      filtered = filtered.filter(({ profile }) => (profile.compatibility?.total || 0) >= 88);
    } else if (filterType === 'kongu') {
      filtered = filtered.filter(({ profile }) =>
        ['Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Namakkal', 'Karur', 'Dindigul'].includes(profile.district) ||
        ['Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Namakkal', 'Karur', 'Dindigul'].includes(profile.nativePlace)
      );
    } else if (filterType === 'verified') {
      filtered = filtered.filter(({ profile }) => profile.isVerified);
    }

    // Sort
    if (sortBy === 'compatibility') {
      filtered.sort((a, b) => (b.profile.compatibility?.total || 0) - (a.profile.compatibility?.total || 0));
    } else if (sortBy === 'age_asc') {
      filtered.sort((a, b) => a.profile.age - b.profile.age);
    } else if (sortBy === 'age_desc') {
      filtered.sort((a, b) => b.profile.age - a.profile.age);
    } else {
      // Default: recently added
      filtered.sort((a, b) => (b.record.addedAt || '').localeCompare(a.record.addedAt || ''));
    }

    return filtered;
  }, [shortlists, profiles, searchQuery, filterType, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-xl space-y-3">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-kolam-pattern" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
            <KolamMotif size={16} color="#F3E5AB" />
            <span>Private Matrimonial Saved List</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-200/90 bg-black/40 px-3 py-1 rounded-full border border-amber-400/30">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Private to your account</span>
          </div>
        </div>

        <div className="relative space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-brand text-amber-100 flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>Shortlisted Profiles</span>
            <span className="text-sm sm:text-base font-normal font-sans text-amber-200">
              ({shortlists.length})
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90">
            Profiles you've saved for later.
          </p>
          <p className="text-xs text-amber-300/80 font-tamil">
            குடும்ப விவாதத்திற்காக நீங்கள் குறித்து வைத்துள்ள மணமக்கள் பட்டியல்.
          </p>
        </div>
      </div>

      {/* 2. Controls & Search Toolbar */}
      <div className="bg-white dark:bg-[#1A0F12] p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search in Shortlist */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search in shortlist by name, ID, city, career..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              All ({shortlists.length})
            </button>
            <button
              onClick={() => setFilterType('compatible')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 cursor-pointer ${
                filterType === 'compatible'
                  ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>High Match (88%+)</span>
            </button>
            <button
              onClick={() => setFilterType('kongu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 cursor-pointer ${
                filterType === 'kongu'
                  ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <MapPin className="w-3 h-3 text-rose-500" />
              <span>Kongu Native</span>
            </button>
            <button
              onClick={() => setFilterType('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 cursor-pointer ${
                filterType === 'verified'
                  ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified Only</span>
            </button>
          </div>

          {/* Sorting & Layout Toggles */}
          <div className="flex items-center gap-2 justify-between md:justify-end">
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="recently_added">Recently Shortlisted</option>
                <option value="compatibility">Highest Compatibility</option>
                <option value="age_asc">Age: Youngest First</option>
                <option value="age_desc">Age: Eldest First</option>
              </select>
            </div>

            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 shrink-0">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-white dark:bg-stone-900 text-[#7A1C2E] dark:text-amber-400 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutMode === 'list'
                    ? 'bg-white dark:bg-stone-900 text-[#7A1C2E] dark:text-amber-400 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Shortlisted Profiles List / Empty State */}
      {shortlistedProfiles.length > 0 ? (
        <div
          className={
            layoutMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {shortlistedProfiles.map(({ profile }) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              layout={layoutMode}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 sm:p-16 text-center bg-white dark:bg-[#1A0F12] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto text-[#7A1C2E] dark:text-amber-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
              {shortlists.length === 0 ? 'No Profiles Shortlisted Yet' : 'No Shortlisted Profiles Match Filter'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              {shortlists.length === 0
                ? "Save profiles you're interested in and come back to them later for family discussions and horoscope comparisons."
                : 'Try adjusting your search keyword or switching filters to see all your saved profiles.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('search')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore Profiles</span>
            </button>

            {shortlists.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="px-4 py-2.5 text-xs text-amber-800 dark:text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
