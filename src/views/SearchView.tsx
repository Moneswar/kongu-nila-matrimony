import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchFilterDrawer } from '../components/search/SearchFilterDrawer';
import { ProfileCard } from '../components/profile/ProfileCard';
import { useAuth } from '../context/AuthContext';
import { useMatrimony } from '../context/MatrimonyContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { searchService, defaultSearchFilters } from '../services/searchService';
import { KolamMotif } from '../components/common/KolamMotif';
import {
  SlidersHorizontal,
  Sparkles,
  LayoutGrid,
  List,
  Search,
  Bookmark,
  RotateCcw,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Trash2,
  Filter,
  GraduationCap,
  Briefcase,
  ChevronDown,
  ArrowUpDown,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { SearchFilterState, MaritalStatus, FoodPreference, DoshamType, Gender, Profile } from '../types';

const POPULAR_SEARCH_SUGGESTIONS = [
  'Coimbatore Software Engineers',
  'Erode Kongu Vellalar Doctors',
  'Vellode Kootam',
  'Sengunni Kootam',
  'Porulanthai Kootam',
  'Salem Architects',
  'Tiruppur Industrialists',
  'Global NRI Profiles'
];

export const SearchView: React.FC = () => {
  const {
    profiles,
    searchFilters,
    setSearchFilters,
    savedSearches,
    saveCurrentSearch,
    deleteSavedSearch,
    openFilterDrawer,
    viewMode,
    setViewMode
  } = useMatrimony();

  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const { showToast } = useToast();

  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [savedSearchModalOpen, setSavedSearchModalOpen] = useState(false);
  const [searchTitleInput, setSearchTitleInput] = useState('My Kongu Matches');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(searchFilters.searchQuery || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pageSize = 6;

  // Quick Search Bar local fields for top bar
  const [quickGender, setQuickGender] = useState<Gender | 'all'>(
    searchFilters.gender ? searchFilters.gender : 'all'
  );
  const [quickAgeMin, setQuickAgeMin] = useState<number>(searchFilters.ageMin || 21);
  const [quickAgeMax, setQuickAgeMax] = useState<number>(searchFilters.ageMax || 35);
  const [quickLocation, setQuickLocation] = useState<string>(
    searchFilters.locations[0] || ''
  );
  const [quickProfession, setQuickProfession] = useState<string>(
    searchFilters.professions[0] || ''
  );

  // Sync quick bar when searchFilters change externally
  useEffect(() => {
    setQuickGender(searchFilters.gender ? searchFilters.gender : 'all');
    setQuickAgeMin(searchFilters.ageMin || 21);
    setQuickAgeMax(searchFilters.ageMax || 35);
    setQuickLocation(searchFilters.locations[0] || '');
    setQuickProfession(searchFilters.professions[0] || '');
    setSearchInput(searchFilters.searchQuery || '');
  }, [searchFilters]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Quick Search submission
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters(prev => ({
      ...prev,
      gender: quickGender === 'all' ? undefined : (quickGender as Gender),
      ageMin: Math.min(quickAgeMin, quickAgeMax),
      ageMax: Math.max(quickAgeMin, quickAgeMax),
      locations: quickLocation ? [quickLocation] : [],
      professions: quickProfession ? [quickProfession] : [],
      searchQuery: searchInput.trim()
    }));
    setCurrentPage(1);
    showToast('Search criteria applied', 'info');
  };

  // Free-text search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSearchFilters(prev => ({ ...prev, searchQuery: searchInput.trim() }));
    setCurrentPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearchFilters(prev => ({ ...prev, searchQuery: '' }));
    setCurrentPage(1);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchInput(suggestion);
    setShowSuggestions(false);
    setSearchFilters(prev => ({ ...prev, searchQuery: suggestion }));
    setCurrentPage(1);
  };

  // Filter and Sort profiles using the central searchService with deterministic compatibility
  const filteredProfiles = useMemo(() => {
    return searchService.filterProfiles(searchFilters, currentUser);
  }, [searchFilters, profiles, currentUser]);

  const handleSearchBasedOnPreferences = () => {
    if (currentUser) {
      const prefFilters = searchService.getFiltersFromPartnerPreferences(currentUser);
      setSearchFilters(prefFilters);
      showToast('Search criteria updated from your Partner Preferences', 'success');
    }
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / pageSize));
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProfiles.slice(start, start + pageSize);
  }, [filteredProfiles, currentPage, pageSize]);

  // Reset to page 1 whenever filters change & simulate smooth state
  useEffect(() => {
    setCurrentPage(1);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 120);
    return () => clearTimeout(timer);
  }, [searchFilters]);

  const handleReset = () => {
    setSearchFilters(defaultSearchFilters);
    setSearchInput('');
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  const handleBroadenSearch = () => {
    setSearchFilters({
      ...defaultSearchFilters,
      ageMin: 20,
      ageMax: 45,
      heightMin: 140,
      heightMax: 210,
      maritalStatus: [],
      locations: [],
      nativePlaces: [],
      subCastes: [],
      communities: [],
      education: [],
      professions: [],
      incomeMin: 0,
      foodPreference: [],
      dosham: [],
      searchQuery: '',
      nriOnly: false,
      withPhotoOnly: false,
      verifiedOnly: false,
      onlineOnly: false,
      horoscopeAvailableOnly: false
    });
    setSearchInput('');
    setCurrentPage(1);
    showToast('Search criteria broadened', 'success');
  };

  // Compute Active Filter Chips
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    if (searchFilters.searchQuery && searchFilters.searchQuery.trim()) {
      chips.push({
        id: 'query',
        label: `Keyword: "${searchFilters.searchQuery}"`,
        onRemove: () => {
          setSearchInput('');
          setSearchFilters(prev => ({ ...prev, searchQuery: '' }));
        }
      });
    }

    if (searchFilters.gender) {
      chips.push({
        id: 'gender',
        label: searchFilters.gender === 'female' ? 'Looking For: Brides (பெண்)' : 'Looking For: Grooms (ஆண்)',
        onRemove: () => setSearchFilters(prev => ({ ...prev, gender: undefined }))
      });
    }

    if (searchFilters.ageMin !== defaultSearchFilters.ageMin || searchFilters.ageMax !== defaultSearchFilters.ageMax) {
      chips.push({
        id: 'age',
        label: `Age: ${searchFilters.ageMin} - ${searchFilters.ageMax} Yrs`,
        onRemove: () => setSearchFilters(prev => ({ ...prev, ageMin: defaultSearchFilters.ageMin, ageMax: defaultSearchFilters.ageMax }))
      });
    }

    if (searchFilters.maritalStatus.length > 0) {
      searchFilters.maritalStatus.forEach(m => {
        chips.push({
          id: `marital_${m}`,
          label: m.replace('_', ' '),
          onRemove: () => setSearchFilters(prev => ({ ...prev, maritalStatus: prev.maritalStatus.filter(s => s !== m) }))
        });
      });
    }

    if (searchFilters.verifiedOnly) {
      chips.push({
        id: 'verified',
        label: '100% ID Verified',
        onRemove: () => setSearchFilters(prev => ({ ...prev, verifiedOnly: false }))
      });
    }

    if (searchFilters.withPhotoOnly) {
      chips.push({
        id: 'photo',
        label: 'With Photos Only',
        onRemove: () => setSearchFilters(prev => ({ ...prev, withPhotoOnly: false }))
      });
    }

    if (searchFilters.onlineOnly) {
      chips.push({
        id: 'online',
        label: 'Active Online',
        onRemove: () => setSearchFilters(prev => ({ ...prev, onlineOnly: false }))
      });
    }

    if (searchFilters.nriOnly) {
      chips.push({
        id: 'nri',
        label: 'NRI Profiles Only',
        onRemove: () => setSearchFilters(prev => ({ ...prev, nriOnly: false }))
      });
    }

    if (searchFilters.horoscopeAvailableOnly) {
      chips.push({
        id: 'horoscope',
        label: 'Horoscope Available',
        onRemove: () => setSearchFilters(prev => ({ ...prev, horoscopeAvailableOnly: false }))
      });
    }

    if (searchFilters.incomeMin > 0) {
      chips.push({
        id: 'income',
        label: `Income: ₹${searchFilters.incomeMin}L+`,
        onRemove: () => setSearchFilters(prev => ({ ...prev, incomeMin: 0 }))
      });
    }

    searchFilters.locations.forEach(loc => {
      chips.push({
        id: `loc_${loc}`,
        label: loc,
        onRemove: () => setSearchFilters(prev => ({ ...prev, locations: prev.locations.filter(l => l !== loc) }))
      });
    });

    (searchFilters.nativePlaces || []).forEach(np => {
      chips.push({
        id: `native_${np}`,
        label: `Native: ${np}`,
        onRemove: () => setSearchFilters(prev => ({ ...prev, nativePlaces: (prev.nativePlaces || []).filter(p => p !== np) }))
      });
    });

    searchFilters.communities.forEach(c => {
      chips.push({
        id: `comm_${c}`,
        label: c,
        onRemove: () => setSearchFilters(prev => ({ ...prev, communities: prev.communities.filter(comm => comm !== c) }))
      });
    });

    searchFilters.subCastes.forEach(k => {
      chips.push({
        id: `kootam_${k}`,
        label: k,
        onRemove: () => setSearchFilters(prev => ({ ...prev, subCastes: prev.subCastes.filter(c => c !== k) }))
      });
    });

    searchFilters.education.forEach(edu => {
      chips.push({
        id: `edu_${edu}`,
        label: edu,
        onRemove: () => setSearchFilters(prev => ({ ...prev, education: prev.education.filter(e => e !== edu) }))
      });
    });

    searchFilters.professions.forEach(prof => {
      chips.push({
        id: `prof_${prof}`,
        label: prof,
        onRemove: () => setSearchFilters(prev => ({ ...prev, professions: prev.professions.filter(p => p !== prof) }))
      });
    });

    searchFilters.foodPreference.forEach(f => {
      chips.push({
        id: `food_${f}`,
        label: f.replace('_', ' '),
        onRemove: () => setSearchFilters(prev => ({ ...prev, foodPreference: prev.foodPreference.filter(food => food !== f) }))
      });
    });

    searchFilters.dosham.forEach(d => {
      chips.push({
        id: `dosham_${d}`,
        label: d === 'no_dosham' ? 'சுத்த ஜாதகம் (No Dosham)' : d.replace('_', ' '),
        onRemove: () => setSearchFilters(prev => ({ ...prev, dosham: prev.dosham.filter(dos => dos !== d) }))
      });
    });

    (searchFilters.rasis || []).forEach(r => {
      chips.push({
        id: `rasi_${r}`,
        label: `Rasi: ${r.split(' ')[0]}`,
        onRemove: () => setSearchFilters(prev => ({ ...prev, rasis: (prev.rasis || []).filter(item => item !== r) }))
      });
    });

    (searchFilters.nakshatras || []).forEach(n => {
      chips.push({
        id: `nak_${n}`,
        label: `Star: ${n}`,
        onRemove: () => setSearchFilters(prev => ({ ...prev, nakshatras: (prev.nakshatras || []).filter(item => item !== n) }))
      });
    });

    return chips;
  }, [searchFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      {/* ====================================================
          SECTION 1: HERO SEARCH HEADER BANNER
          ==================================================== */}
      <div className="relative bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border-2 border-amber-400/40">
        {/* Decorative Kolam Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
          <KolamMotif size={240} color="#FFD700" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-200 border border-amber-300/30 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-tamil">{language === 'ta' ? 'கொங்கு வரன் தேடல் மேடை' : 'Kongu Matrimonial Discovery'}</span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif-brand tracking-tight text-amber-100">
                Find Your Perfect Matrimonial Match
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-tamil mt-1">
                கொங்கு வேளாளர் மணமகன் / மணமகள் வரன்களை ஜாதகம், கூட்டம் மற்றும் தொழில் தகுதிகளோடு எளிதாகத் தேடுங்கள்.
              </p>
            </div>

            {/* Dynamic Result Count Badge */}
            <div className="bg-amber-400/20 border border-amber-300/40 rounded-2xl px-4 py-2 text-right">
              <span className="block text-xl sm:text-2xl font-bold text-amber-200 font-serif-brand">
                {filteredProfiles.length}
              </span>
              <span className="text-[11px] text-amber-100/80 font-medium">
                profiles found
              </span>
            </div>
          </div>

          {/* Quick Keyword Search Form with Suggestions */}
          <div ref={searchContainerRef} className="relative pt-2 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchInput}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search by Name, Profile ID (KNM-...), City, Kootam, Star, Profession..."
                  className="w-full pl-10 pr-9 py-2.5 bg-white/95 text-stone-900 placeholder:text-stone-400 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-hidden shadow-inner"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 btn-gold text-stone-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {/* Auto Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#160A0D] rounded-2xl p-3 border border-stone-200 dark:border-amber-500/30 shadow-2xl z-30 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                <span className="block text-[10px] uppercase font-bold text-stone-400 dark:text-amber-400/80 mb-2 px-1">
                  Popular Match Searches
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCH_SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="px-2.5 py-1 bg-stone-100 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/70 text-stone-700 dark:text-amber-200 hover:text-[#7A1C2E] dark:hover:text-amber-300 rounded-lg text-[11px] font-semibold transition cursor-pointer border border-transparent dark:border-amber-500/20"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Saved Searches Quick Bar */}
        {savedSearches.length > 0 && (
          <div className="relative z-10 mt-6 pt-4 border-t border-amber-400/20 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-amber-200/90 font-bold shrink-0 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-300" /> Saved Searches:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto">
              {savedSearches.map(ss => (
                <div
                  key={ss.id}
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 text-amber-100 rounded-full border border-amber-300/30 text-[11px] font-semibold transition shrink-0 pl-3 pr-1 py-0.5"
                >
                  <button
                    type="button"
                    onClick={() => setSearchFilters(ss.filters)}
                    className="flex items-center gap-1.5 py-0.5 cursor-pointer"
                  >
                    <span>{ss.title}</span>
                    <span className="text-[10px] bg-amber-400/30 px-1.5 py-0.2 rounded-full text-amber-200 font-mono">
                      {ss.matchesCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSavedSearch(ss.id)}
                    className="p-1 hover:text-rose-400 ml-1 cursor-pointer transition"
                    title="Remove saved search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          SECTION 2: PROMINENT QUICK SEARCH BAR
          ==================================================== */}
      <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-5 sm:p-6 border border-[#EFE6DA] dark:border-amber-500/20 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7A1C2E]/10 dark:bg-amber-400/10 flex items-center justify-center text-[#7A1C2E] dark:text-amber-400 border border-amber-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
                Quick Match Filter
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Filter by core criteria or refine with the full filter suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                type="button"
                onClick={handleSearchBasedOnPreferences}
                className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 rounded-xl text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
                <span>Search by My Preferences</span>
              </button>
            )}

            <button
              type="button"
              onClick={openFilterDrawer}
              className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:text-rose-800 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>All Advanced Filters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleQuickSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-semibold">
          {/* 1. Looking For */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
              Looking For
            </label>
            <select
              value={quickGender}
              onChange={e => setQuickGender(e.target.value as Gender | 'all')}
              className="w-full bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            >
              <option value="all">All (Brides & Grooms)</option>
              <option value="female">Bride (மணமகள்)</option>
              <option value="male">Groom (மணமகன்)</option>
            </select>
          </div>

          {/* 2. Age Range */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
              Age ({quickAgeMin} to {quickAgeMax} yrs)
            </label>
            <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-[#140C0E] p-2 rounded-xl border border-stone-200 dark:border-stone-700">
              <select
                value={quickAgeMin}
                onChange={e => setQuickAgeMin(Number(e.target.value))}
                className="bg-transparent text-stone-900 dark:text-stone-100 font-bold focus:outline-hidden w-full text-xs"
              >
                {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(a => (
                  <option key={a} value={a} className="dark:bg-stone-900">{a} Yrs</option>
                ))}
              </select>
              <span className="text-stone-400 font-medium text-[11px]">to</span>
              <select
                value={quickAgeMax}
                onChange={e => setQuickAgeMax(Number(e.target.value))}
                className="bg-transparent text-stone-900 dark:text-stone-100 font-bold focus:outline-hidden w-full text-xs"
              >
                {[25, 26, 27, 28, 29, 30, 32, 35, 38, 42, 48].map(a => (
                  <option key={a} value={a} className="dark:bg-stone-900">{a} Yrs</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Location */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
              District / Location
            </label>
            <select
              value={quickLocation}
              onChange={e => setQuickLocation(e.target.value)}
              className="w-full bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs"
            >
              <option value="">All Districts (அனைத்தும்)</option>
              <option value="Coimbatore">Coimbatore (கோவை)</option>
              <option value="Erode">Erode (ஈரோடு)</option>
              <option value="Tiruppur">Tiruppur (திருப்பூர்)</option>
              <option value="Salem">Salem (சேலம்)</option>
              <option value="Namakkal">Namakkal (நாமக்கல்)</option>
              <option value="Karur">Karur (கரூர்)</option>
              <option value="Chennai">Chennai (சென்னை)</option>
              <option value="Bangalore">Bangalore (பெங்களூரு)</option>
              <option value="United States">United States (NRI)</option>
              <option value="Singapore">Singapore (NRI)</option>
              <option value="United Kingdom">United Kingdom (NRI)</option>
            </select>
          </div>

          {/* 4. Profession */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
              Profession
            </label>
            <select
              value={quickProfession}
              onChange={e => setQuickProfession(e.target.value)}
              className="w-full bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs"
            >
              <option value="">Any Profession</option>
              <option value="Software">Software / Tech</option>
              <option value="Doctor">Doctor / Medical</option>
              <option value="Architect">Architect</option>
              <option value="Chartered Accountant">CA / Finance</option>
              <option value="Industrialist">Industrialist / Business</option>
              <option value="Civil">Civil / Govt Officer</option>
            </select>
          </div>

          {/* 5. Primary CTA */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 btn-primary text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer h-[42px]"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Search Profiles</span>
            </button>
          </div>
        </form>
      </div>

      {/* ====================================================
          SECTION 3: MAIN 2-COLUMN DISCOVERY SECTION
          ==================================================== */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filter Sidebar (Desktop Sticky / Mobile Drawer) */}
        <SearchFilterDrawer
          filters={searchFilters}
          setFilters={setSearchFilters}
          totalMatches={filteredProfiles.length}
          onReset={handleReset}
          onSaveSearchModal={() => setSavedSearchModalOpen(true)}
        />

        {/* Right Search Results Main Container */}
        <main className="flex-1 w-full space-y-4">
          {/* Action & Sort Toolbar */}
          <div className="bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Result Count */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-amber-100 text-sm font-serif-brand">
                    {filteredProfiles.length} Matching Profiles Found
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    (Page {currentPage} of {totalPages})
                  </span>
                </div>
              </div>

              {/* Controls Group */}
              <div className="flex items-center gap-2.5 flex-wrap ml-auto">
                {/* Mobile Filter Toggle Button */}
                <button
                  type="button"
                  onClick={openFilterDrawer}
                  className="lg:hidden px-3.5 py-2 btn-primary text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters {activeChips.length > 0 && `(${activeChips.length})`}</span>
                </button>

                {/* Perspective View Mode: Personal vs Family */}
                <div className="flex items-center bg-stone-100 dark:bg-[#140C0E] p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setViewMode('personal')}
                    className={`px-3 py-1 rounded-lg transition font-bold text-[11px] cursor-pointer ${
                      viewMode === 'personal'
                        ? 'bg-[#7A1C2E] text-white shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    Personal View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('family')}
                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1 font-bold text-[11px] cursor-pointer ${
                      viewMode === 'family'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    Family / Kootam
                  </button>
                </div>

                {/* Grid / List Layout Switch */}
                <div className="flex items-center bg-stone-100 dark:bg-[#140C0E] p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setLayoutView('grid')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      layoutView === 'grid'
                        ? 'bg-[#7A1C2E] text-white shadow-2xs'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutView('list')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      layoutView === 'list'
                        ? 'bg-[#7A1C2E] text-white shadow-2xs'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={searchFilters.sortBy}
                    onChange={e => setSearchFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 font-bold px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="compatibility">Best Match (பொருத்தம்)</option>
                    <option value="recently_active">Recently Active</option>
                    <option value="newest">Recently Joined</option>
                    <option value="age_asc">Age: Low to High</option>
                    <option value="age_desc">Age: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips Row */}
            {activeChips.length > 0 && (
              <div className="pt-3 border-t border-stone-100 dark:border-amber-500/15 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-500 dark:text-amber-400 shrink-0 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-amber-600" /> Active Filters ({activeChips.length}):
                </span>

                {activeChips.map(chip => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#7A1C2E] dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-[11px] font-semibold"
                  >
                    <span>{chip.label}</span>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                      title="Remove filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-bold text-stone-500 hover:text-[#7A1C2E] dark:hover:text-amber-400 ml-auto flex items-center gap-1 transition px-2 py-0.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear All
                </button>
              </div>
            )}
          </div>

          {/* Profiles Loading Skeleton State */}
          {isLoading ? (
            <div className={`grid ${layoutView === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-5`}>
              {[1, 2, 3, 4].map(idx => (
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
          ) : paginatedProfiles.length > 0 ? (
            /* Profiles Grid / List Output */
            <div className={`grid ${layoutView === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-5`}>
              {paginatedProfiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  layout={layoutView}
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
                No profiles found
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed font-tamil">
                தேர்ந்தெடுக்கப்பட்ட நிபந்தனைகளுக்குப் பொருத்தமான வரன்கள் இல்லை. உங்கள் விருப்பங்களை மாற்றி அமைக்கவும்.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleBroadenSearch}
                  className="px-6 py-2.5 btn-gold text-stone-950 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Broaden Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 text-xs font-semibold shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-1 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl font-bold transition text-xs cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#7A1C2E] text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-1 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Save Search Modal */}
      {savedSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl p-6 max-w-sm w-full border border-[#EFE6DA] dark:border-amber-500/30 shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-amber-500/20">
              <h3 className="text-sm font-bold text-stone-900 dark:text-amber-100 font-serif-brand flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-600" /> Save Search Criteria
              </h3>
              <button
                type="button"
                onClick={() => setSavedSearchModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-stone-500 dark:text-stone-400 leading-relaxed font-tamil">
              இந்தத் தேடல் நிபந்தனைகளைச் சேமித்து வைத்தால், அடுத்த முறை ஒரே கிளிக்கில் பொருந்தும் வரன்களைப் பார்க்கலாம்.
            </p>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1.5">
                Search Query Title (தேடல் பெயர்)
              </label>
              <input
                type="text"
                value={searchTitleInput}
                onChange={e => setSearchTitleInput(e.target.value)}
                placeholder="e.g. Coimbatore Doctors, Vellode Kootam"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-stone-100 dark:border-amber-500/20">
              <button
                type="button"
                onClick={() => setSavedSearchModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (searchTitleInput.trim()) {
                    saveCurrentSearch(searchTitleInput.trim());
                    setSavedSearchModalOpen(false);
                    showToast(`Saved search "${searchTitleInput.trim()}"`, 'success');
                  }
                }}
                className="px-5 py-2 btn-primary text-white rounded-xl font-bold shadow-md transition cursor-pointer"
              >
                Save Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
