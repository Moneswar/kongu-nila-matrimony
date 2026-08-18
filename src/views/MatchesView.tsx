import React, { useState, useMemo, useEffect } from 'react';
import { useMatrimony } from '../context/MatrimonyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProfileCard } from '../components/profile/ProfileCard';
import { KolamMotif } from '../components/common/KolamMotif';
import { WhyThisMatchModal } from '../components/matches/WhyThisMatchModal';
import { MatchSkeleton } from '../components/matches/MatchSkeleton';
import { matchingService } from '../services/matchingService';
import { Profile } from '../types';
import {
  Sparkles,
  Compass,
  MapPin,
  Globe,
  ShieldCheck,
  Heart,
  LayoutGrid,
  List,
  Clock,
  UserCheck,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Search,
  Edit3,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Info,
  CheckCircle2,
  Bookmark,
  Users,
  Eye,
  RefreshCw
} from 'lucide-react';

interface MatchesViewProps {
  setCurrentTab?: (tab: string) => void;
}

type MatchCategory =
  | 'recommended'
  | 'high_compatibility'
  | 'good_matches'
  | 'new_matches'
  | 'recently_active'
  | 'nearby'
  | 'preferences';

export const MatchesView: React.FC<MatchesViewProps> = ({ setCurrentTab }) => {
  const {
    profiles,
    shortlists,
    interests,
    toggleShortlist,
    sendInterest,
    openProfileDetail
  } = useMatrimony();

  const { currentUser, profileCompletion } = useAuth();
  const { showToast } = useToast();

  // Category Tab
  const [matchCategory, setMatchCategory] = useState<MatchCategory>('recommended');
  
  // Layout and Sorting
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<
    'compatibility' | 'recently_active' | 'newest' | 'age_asc' | 'age_desc'
  >('compatibility');

  // Lightweight Match Refinement Filters
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [educationFilter, setEducationFilter] = useState<string>('all');
  const [minCompatibility, setMinCompatibility] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);
  const [showRefinements, setShowRefinements] = useState<boolean>(false);

  // Why This Match Modal State
  const [selectedMatchForWhy, setSelectedMatchForWhy] = useState<Profile | null>(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);

  // Loading & Refreshing States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const categories = [
    {
      id: 'recommended' as MatchCategory,
      label: 'Recommended',
      labelTa: 'பரிந்துரைக்கப்பட்டவை',
      description: 'Handpicked matches based on your profile & family expectations',
      icon: Sparkles,
      color: 'text-amber-500',
      badge: 'Curated'
    },
    {
      id: 'high_compatibility' as MatchCategory,
      label: 'Highly Compatible',
      labelTa: 'உயர் ஜாதகப் பொருத்தம்',
      description: 'Profiles with 88%+ compatibility score',
      icon: Compass,
      color: 'text-rose-500',
      badge: '88%+'
    },
    {
      id: 'good_matches' as MatchCategory,
      label: 'Good Matches',
      labelTa: 'நல்ல பொருத்தங்கள்',
      description: 'Compatible profiles with 70-87% score',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      badge: '70%+'
    },
    {
      id: 'new_matches' as MatchCategory,
      label: 'New Matches',
      labelTa: 'புதிய வரன்கள்',
      description: 'Recently joined verified Kongu brides and grooms',
      icon: UserCheck,
      color: 'text-purple-500',
      badge: 'New'
    },
    {
      id: 'recently_active' as MatchCategory,
      label: 'Recently Active',
      labelTa: 'செயலில் உள்ளவர்கள்',
      description: 'Online now or active within recent hours for fast replies',
      icon: Clock,
      color: 'text-teal-500',
      badge: 'Active'
    },
    {
      id: 'nearby' as MatchCategory,
      label: 'Nearby (Kongu Belt)',
      labelTa: 'கொங்கு மண்டலம்',
      description: 'Matches native to Coimbatore, Erode, Tiruppur, Salem & Namakkal',
      icon: MapPin,
      color: 'text-amber-600',
      badge: 'Western TN'
    },
    {
      id: 'preferences' as MatchCategory,
      label: 'Partner Preferences',
      labelTa: 'விருப்பத்திற்கு ஏற்ப',
      description: 'Profiles strictly matching your exact age, height & career criteria',
      icon: Filter,
      color: 'text-sky-500',
      badge: 'Strict'
    }
  ];

  const handleCategoryChange = (category: MatchCategory) => {
    setIsLoading(true);
    setMatchCategory(category);
    setTimeout(() => {
      setIsLoading(false);
    }, 120);
  };

  const handleRefreshMatches = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Matches refreshed with latest profile preferences', 'success');
    }, 250);
  };

  const handleResetRefinements = () => {
    setAgeFilter('all');
    setLocationFilter('all');
    setEducationFilter('all');
    setMinCompatibility(0);
    setVerifiedOnly(false);
    setOnlineOnly(false);
    showToast('Match filters reset to default', 'info');
  };

  const hasActiveRefinements =
    ageFilter !== 'all' ||
    locationFilter !== 'all' ||
    educationFilter !== 'all' ||
    minCompatibility > 0 ||
    verifiedOnly ||
    onlineOnly;

  // Base Scored Matches derived via deterministic matchingService
  const scoredMatches = useMemo(() => {
    return matchingService.getRecommendations(currentUser, profiles);
  }, [currentUser, profiles]);

  // Filtered & Sorted Matches
  const filteredMatches = useMemo(() => {
    if (hasError) return [];

    let list = [...scoredMatches];

    // Apply Category Filter
    switch (matchCategory) {
      case 'high_compatibility':
        list = list.filter(p => (p.compatibility?.total || 0) >= 88);
        break;
      case 'good_matches':
        list = list.filter(p => (p.compatibility?.total || 0) >= 70 && (p.compatibility?.total || 0) < 88);
        break;
      case 'new_matches':
        list = list.filter(p => p.membershipTier === 'premium' || p.isVerified || p.registeredDate?.includes('2024') || p.registeredDate?.includes('2025'));
        break;
      case 'recently_active':
        list = list.filter(
          p => p.isOnline || (p.lastActive && (p.lastActive.includes('min') || p.lastActive.includes('hour') || p.lastActive.includes('today') || p.lastActive.includes('now')))
        );
        break;
      case 'nearby':
        list = list.filter(p =>
          ['Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Namakkal', 'Karur', 'Dindigul'].includes(p.district) ||
          ['Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Namakkal', 'Karur', 'Dindigul'].includes(p.nativePlace)
        );
        break;
      case 'preferences':
        list = list.filter(p => {
          const userPref = currentUser?.partnerPreferences;
          if (!userPref) return (p.compatibility?.total || 0) >= 85;
          const ageOk = !userPref.ageRange || (p.age >= userPref.ageRange[0] && p.age <= userPref.ageRange[1]);
          return ageOk;
        });
        break;
      case 'recommended':
      default:
        // Show all sorted by compatibility
        break;
    }

    // Secondary Refinements
    if (ageFilter !== 'all') {
      if (ageFilter === '21-25') list = list.filter(p => p.age >= 21 && p.age <= 25);
      else if (ageFilter === '26-29') list = list.filter(p => p.age >= 26 && p.age <= 29);
      else if (ageFilter === '30-33') list = list.filter(p => p.age >= 30 && p.age <= 33);
      else if (ageFilter === '34+') list = list.filter(p => p.age >= 34);
    }

    if (locationFilter !== 'all') {
      if (locationFilter === 'kongu') {
        list = list.filter(p =>
          ['Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Namakkal', 'Karur'].includes(p.district) ||
          ['Pollachi', 'Gobichettipalayam', 'Bhavani', 'Kangeyam', 'Perundurai'].includes(p.nativePlace)
        );
      } else if (locationFilter === 'chennai_tn') {
        list = list.filter(p => p.state === 'Tamil Nadu' && !['Coimbatore', 'Erode', 'Tiruppur'].includes(p.district));
      } else if (locationFilter === 'nri') {
        list = list.filter(
          p =>
            ['United States', 'Singapore', 'United Kingdom', 'Canada', 'Australia', 'UAE'].includes(p.country) ||
            p.city.toLowerCase().includes('usa') ||
            p.city.toLowerCase().includes('singapore') ||
            p.country !== 'India'
        );
      }
    }

    if (educationFilter !== 'all') {
      if (educationFilter === 'engineering') {
        list = list.filter(p => p.profession?.toLowerCase().includes('engineer') || p.degree?.toLowerCase().includes('b.e') || p.degree?.toLowerCase().includes('b.tech') || p.profession?.toLowerCase().includes('software'));
      } else if (educationFilter === 'medical') {
        list = list.filter(p => p.profession?.toLowerCase().includes('doctor') || p.degree?.toLowerCase().includes('mbbs') || p.degree?.toLowerCase().includes('md'));
      } else if (educationFilter === 'ca_finance') {
        list = list.filter(p => p.profession?.toLowerCase().includes('ca') || p.profession?.toLowerCase().includes('accountant') || p.profession?.toLowerCase().includes('finance'));
      }
    }

    if (minCompatibility > 0) {
      list = list.filter(p => (p.compatibility?.total || 0) >= minCompatibility);
    }

    if (verifiedOnly) {
      list = list.filter(p => p.isVerified);
    }

    if (onlineOnly) {
      list = list.filter(p => p.isOnline);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'compatibility') {
        return (b.compatibility?.total || 0) - (a.compatibility?.total || 0);
      }
      if (sortBy === 'recently_active') {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
      }
      if (sortBy === 'age_asc') {
        return a.age - b.age;
      }
      if (sortBy === 'age_desc') {
        return b.age - a.age;
      }
      return 0;
    });

    return list;
  }, [scoredMatches, matchCategory, ageFilter, locationFilter, educationFilter, minCompatibility, verifiedOnly, onlineOnly, sortBy, hasError]);

  const activeCategoryObj = categories.find(c => c.id === matchCategory) || categories[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* ====================================================
          SECTION 1: HERO HEADER BANNER
          ==================================================== */}
      <div className="relative bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border-2 border-amber-400/40">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
          <KolamMotif size={240} color="#FFD700" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-200 border border-amber-300/30 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Deterministic Smart Match System • பொருத்தம்</span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif-brand tracking-tight text-amber-100">
                Recommended Matches
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mt-1">
                Profiles selected based on your preferences and profile information.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-400/20 border border-amber-300/40 rounded-2xl px-4 py-2 text-right">
                <span className="block text-xl sm:text-2xl font-bold text-amber-200 font-serif-brand">
                  {scoredMatches.length}
                </span>
                <span className="text-[11px] text-amber-100/80 font-medium">
                  matches available
                </span>
              </div>

              <button
                type="button"
                onClick={handleRefreshMatches}
                className="p-3 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 rounded-2xl text-amber-200 hover:text-white transition cursor-pointer"
                title="Refresh recommendations"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          SECTION 2: PROFILE & PREFERENCE COMPLETENESS CALLOUT
          ==================================================== */}
      {profileCompletion?.score < 90 && (
        <div className="bg-amber-50/80 dark:bg-[#1A0F12] border border-amber-300 dark:border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0 border border-amber-400/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
                Complete your profile to get more relevant matches
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Your profile is {profileCompletion?.score || 70}% complete. Add horoscope, native place & partner preferences for higher precision matching.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentTab && setCurrentTab('my-profile')}
              className="px-4 py-2 btn-primary text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Complete Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          SECTION 3: MATCH CATEGORY TABS
          ==================================================== */}
      <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-3 border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = matchCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#7A1C2E] to-[#5C1020] text-white border-amber-400/60 shadow-md scale-[1.02]'
                    : 'bg-stone-50/70 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : cat.color}`} />
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-amber-400/30 text-amber-200 border border-amber-300/40'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>
                <div className="mt-2">
                  <strong className={`block text-xs font-serif-brand ${isActive ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                    {cat.label}
                  </strong>
                  <span className={`text-[10px] block font-tamil truncate ${isActive ? 'text-amber-200' : 'text-stone-500 dark:text-stone-400'}`}>
                    {cat.labelTa}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================
          SECTION 4: REFINEMENT TOOLBAR & CONTROLS
          ==================================================== */}
      <div className="bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Category Description & Count */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 dark:text-amber-100 text-sm font-serif-brand">
                {filteredMatches.length} {activeCategoryObj.label} Matches
              </span>
              {hasActiveRefinements && (
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Filtered
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {activeCategoryObj.description}
            </p>
          </div>

          {/* Controls: Refinement Toggle, View Mode, Sort */}
          <div className="flex items-center gap-2.5 flex-wrap ml-auto">
            <button
              type="button"
              onClick={() => setShowRefinements(!showRefinements)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                showRefinements || hasActiveRefinements
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-[#7A1C2E] dark:text-amber-300'
                  : 'bg-stone-50 dark:bg-[#140C0E] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Refine Matches</span>
            </button>

            {/* Grid / List Layout Switch */}
            <div className="flex items-center bg-stone-100 dark:bg-[#140C0E] p-1 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-[#7A1C2E] text-white shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutMode === 'list'
                    ? 'bg-[#7A1C2E] text-white shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 font-bold px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
              >
                <option value="compatibility">Highest Compatibility (பொருத்தம்)</option>
                <option value="recently_active">Recently Active</option>
                <option value="newest">Recently Joined (Newest)</option>
                <option value="age_asc">Age: Low to High</option>
                <option value="age_desc">Age: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Secondary Filter Drawer Box */}
        {showRefinements && (
          <div className="pt-3 border-t border-stone-100 dark:border-amber-500/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-semibold animate-in fade-in duration-200">
            {/* Age Filter */}
            <div>
              <label className="block text-stone-600 dark:text-stone-400 mb-1">Age Bracket</label>
              <select
                value={ageFilter}
                onChange={e => setAgeFilter(e.target.value)}
                className="w-full bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 p-2 rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
              >
                <option value="all">All Ages</option>
                <option value="21-25">21 - 25 Years</option>
                <option value="26-29">26 - 29 Years</option>
                <option value="30-33">30 - 33 Years</option>
                <option value="34+">34+ Years</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-stone-600 dark:text-stone-400 mb-1">Regional Belt</label>
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="w-full bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 p-2 rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
              >
                <option value="all">All Locations</option>
                <option value="kongu">Kongu Belt (Coimbatore / Erode / Tiruppur)</option>
                <option value="chennai_tn">Other Tamil Nadu / Chennai</option>
                <option value="nri">Global / NRI Profiles</option>
              </select>
            </div>

            {/* Education / Career Filter */}
            <div>
              <label className="block text-stone-600 dark:text-stone-400 mb-1">Academic & Career</label>
              <select
                value={educationFilter}
                onChange={e => setEducationFilter(e.target.value)}
                className="w-full bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 p-2 rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
              >
                <option value="all">All Professions</option>
                <option value="engineering">Software & Engineering</option>
                <option value="medical">Doctors & Healthcare</option>
                <option value="ca_finance">Chartered Accountants & Finance</option>
              </select>
            </div>

            {/* Quick Checkbox & Reset */}
            <div className="flex items-end justify-between gap-2">
              <label className="flex items-center gap-2 p-2 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={e => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <span className="text-[11px] text-stone-800 dark:text-stone-200">Verified Only</span>
              </label>

              {hasActiveRefinements && (
                <button
                  type="button"
                  onClick={handleResetRefinements}
                  className="p-2 rounded-xl text-stone-500 hover:text-rose-600 transition cursor-pointer"
                  title="Clear filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          SECTION 5: MATCHES RESULTS GRID / LIST
          ==================================================== */}
      {isLoading ? (
        <div className={`grid ${layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {[1, 2, 3, 4, 5, 6].map(idx => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1A0F12] rounded-2xl p-5 border border-stone-200 dark:border-stone-800 animate-pulse flex gap-4"
            >
              <div className="w-32 h-40 bg-stone-200 dark:bg-stone-800 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="w-3/4 h-5 bg-stone-200 dark:bg-stone-800 rounded-md" />
                <div className="w-1/2 h-3 bg-stone-200 dark:bg-stone-800 rounded-md" />
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-md" />
                <div className="w-2/3 h-3 bg-stone-200 dark:bg-stone-800 rounded-md" />
                <div className="w-full h-8 bg-stone-200 dark:bg-stone-800 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className={`grid ${layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {filteredMatches.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              layout={layoutMode}
            />
          ))}
        </div>
      ) : (
        /* Professional Empty State */
        <div className="text-center py-16 bg-white dark:bg-[#1A0F12] rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center mx-auto text-amber-700 border border-amber-300 dark:border-amber-500/30">
            <KolamMotif size={32} color="#D4AF37" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
            No Matches Found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed font-tamil">
            தேர்ந்தெடுக்கப்பட்ட வகைக்குப் பொருத்தமான வரன்கள் இல்லை. உங்கள் துணை எதிர்பார்ப்புகளை மாற்றி அமைக்கவும் அல்லது வரன்களைத் தேடவும்.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentTab && setCurrentTab('my-profile')}
              className="px-6 py-2.5 btn-gold text-stone-950 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
            >
              Update Preferences
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab && setCurrentTab('search')}
              className="px-6 py-2.5 btn-primary text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
            >
              Search Profiles
            </button>
          </div>
        </div>
      )}

      {/* Why This Match Modal */}
      {selectedMatchForWhy && (
        <WhyThisMatchModal
          profile={selectedMatchForWhy}
          isOpen={isWhyModalOpen}
          onClose={() => setIsWhyModalOpen(false)}
          onViewProfile={p => openProfileDetail(p)}
          onSendInterest={p => sendInterest(p)}
          onToggleShortlist={p => toggleShortlist(p)}
          isShortlisted={shortlists.some(s => s.profileId === selectedMatchForWhy.id)}
          isInterestSent={interests.some(i => i.toProfileId === selectedMatchForWhy.id && i.fromProfileId === 'current_user')}
        />
      )}
    </div>
  );
};
