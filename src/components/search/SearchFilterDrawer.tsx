import React, { useState, useMemo } from 'react';
import {
  SearchFilterState,
  Gender,
  FoodPreference,
  DoshamType,
  MaritalStatus,
  FamilyType,
  FamilyValues
} from '../../types';
import { useMatrimony } from '../../context/MatrimonyContext';
import {
  X,
  RotateCcw,
  Sparkles,
  Filter,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Moon,
  Coffee,
  Check,
  Info
} from 'lucide-react';
import { KolamMotif } from '../common/KolamMotif';

interface SearchFilterDrawerProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  totalMatches: number;
  onReset: () => void;
  onSaveSearchModal: () => void;
}

const KONGU_KOOTAMS = [
  'Vellode Kootam',
  'Sengunni Kootam',
  'Porulanthai Kootam',
  'Aadai Kootam',
  'Sempoothan Kootam',
  'Pavalan Kootam',
  'Kannakkan Kootam',
  'Muzhukkadhan Kootam',
  'Vilayan Kootam',
  'Thoravalur Kootam',
  'Kadiyar Kootam',
  'Kaveri Kootam',
  'Thazhiyan Kootam',
  'Pillan Kootam',
  'Ennai Kootam',
  'Danvantri Kootam',
  'Koorai Kootam',
  'Maniyan Kootam',
  'Pannai Kootam',
  'Muthan Kootam',
  'Aadhirai Kootam',
  'Eenjan Kootam',
  'Kaada Kootam'
];

const COMMUNITIES = [
  'Kongu Vellalar',
  'Kongu Chettiar',
  'Kongu Naicker',
  'Tamil Community (All)'
];

const LOCATIONS = [
  'Coimbatore',
  'Erode',
  'Tiruppur',
  'Salem',
  'Namakkal',
  'Karur',
  'Chennai',
  'Bangalore',
  'United States',
  'United Kingdom',
  'Singapore',
  'Australia',
  'UAE / Dubai'
];

const NATIVE_PLACES = [
  'Pollachi',
  'Gobichettipalayam',
  'Dharapuram',
  'Bhavani',
  'Kangeyam',
  'Perundurai',
  'Anthiyur',
  'Rasipuram',
  'Omalur',
  'Sathyamangalam',
  'Udumalaipettai',
  'Mettupalayam'
];

const EDUCATION_OPTIONS = [
  'B.E. / B.Tech',
  'M.S. / M.Tech',
  'MBBS / MD / MS',
  'MBA / PGDM',
  'Chartered Accountant (CA)',
  'Ph.D. / Doctorate',
  'Bachelor of Science / Arts',
  'Master of Science / MCA'
];

const PROFESSIONS = [
  'Software / Tech',
  'Doctor / Medical',
  'Architect / Design',
  'Chartered Accountant (CA)',
  'Industrialist / Business',
  'Civil / Govt Officer',
  'Banking & Finance',
  'Professor / Academic'
];

const RASIS = [
  'Mesham (Aries)',
  'Rishabam (Taurus)',
  'Mithunam (Gemini)',
  'Kadagam (Cancer)',
  'Simmam (Leo)',
  'Kanni (Virgo)',
  'Thulaam (Libra)',
  'Vrichigam (Scorpio)',
  'Dhanusu (Sagittarius)',
  'Makaram (Capricorn)',
  'Kumbam (Aquarius)',
  'Meenam (Pisces)'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Karthigai', 'Rohini', 'Mrigashirsham',
  'Thiruvathirai', 'Punarpoosam', 'Poosam', 'Ayilyam',
  'Magam', 'Pooram', 'Uthiram', 'Hastham', 'Chithirai',
  'Swathi', 'Visakam', 'Anusham', 'Kettai',
  'Moolam', 'Pooradam', 'Uthiradam', 'Thiruvonam', 'Avittam',
  'Sathayam', 'Poorattathi', 'Uthirattathi', 'Revathi'
];

export const SearchFilterDrawer: React.FC<SearchFilterDrawerProps> = ({
  filters,
  setFilters,
  totalMatches,
  onReset,
  onSaveSearchModal
}) => {
  const { isFilterDrawerOpen, closeFilterDrawer } = useMatrimony();

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    location: true,
    education: false,
    career: true,
    community: true,
    horoscope: false,
    lifestyle: false,
    family: false,
    trust: true,
  });

  const [kootamSearch, setKootamSearch] = useState('');
  const [nakshatraSearch, setNakshatraSearch] = useState('');

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggles & Handlers
  const toggleLocation = (loc: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter(l => l !== loc)
        : [...prev.locations, loc]
    }));
  };

  const toggleNativePlace = (np: string) => {
    const current = filters.nativePlaces || [];
    setFilters(prev => ({
      ...prev,
      nativePlaces: current.includes(np)
        ? current.filter(p => p !== np)
        : [...current, np]
    }));
  };

  const toggleCommunity = (comm: string) => {
    setFilters(prev => ({
      ...prev,
      communities: prev.communities.includes(comm)
        ? prev.communities.filter(c => c !== comm)
        : [...prev.communities, comm]
    }));
  };

  const toggleKootam = (kootam: string) => {
    setFilters(prev => ({
      ...prev,
      subCastes: prev.subCastes.includes(kootam)
        ? prev.subCastes.filter(k => k !== kootam)
        : [...prev.subCastes, kootam]
    }));
  };

  const toggleEducation = (edu: string) => {
    setFilters(prev => ({
      ...prev,
      education: prev.education.includes(edu)
        ? prev.education.filter(e => e !== edu)
        : [...prev.education, edu]
    }));
  };

  const toggleProfession = (prof: string) => {
    setFilters(prev => ({
      ...prev,
      professions: prev.professions.includes(prof)
        ? prev.professions.filter(p => p !== prof)
        : [...prev.professions, prof]
    }));
  };

  const toggleMaritalStatus = (status: MaritalStatus) => {
    setFilters(prev => ({
      ...prev,
      maritalStatus: prev.maritalStatus.includes(status)
        ? prev.maritalStatus.filter(s => s !== status)
        : [...prev.maritalStatus, status]
    }));
  };

  const toggleFood = (diet: FoodPreference) => {
    setFilters(prev => ({
      ...prev,
      foodPreference: prev.foodPreference.includes(diet)
        ? prev.foodPreference.filter(d => d !== diet)
        : [...prev.foodPreference, diet]
    }));
  };

  const toggleDosham = (dosham: DoshamType) => {
    setFilters(prev => ({
      ...prev,
      dosham: prev.dosham.includes(dosham)
        ? prev.dosham.filter(d => d !== dosham)
        : [...prev.dosham, dosham]
    }));
  };

  const toggleFamilyType = (type: FamilyType) => {
    const current = filters.familyType || [];
    setFilters(prev => ({
      ...prev,
      familyType: current.includes(type) ? current.filter(t => t !== type) : [...current, type]
    }));
  };

  const toggleFamilyValues = (val: FamilyValues) => {
    const current = filters.familyValues || [];
    setFilters(prev => ({
      ...prev,
      familyValues: current.includes(val) ? current.filter(v => v !== val) : [...current, val]
    }));
  };

  const toggleRasi = (rasiName: string) => {
    const current = filters.rasis || [];
    setFilters(prev => ({
      ...prev,
      rasis: current.includes(rasiName) ? current.filter(r => r !== rasiName) : [...current, rasiName]
    }));
  };

  const toggleNakshatra = (nak: string) => {
    const current = filters.nakshatras || [];
    setFilters(prev => ({
      ...prev,
      nakshatras: current.includes(nak) ? current.filter(n => n !== nak) : [...current, nak]
    }));
  };

  // Age validation
  const handleAgeMinChange = (val: number) => {
    setFilters(prev => ({
      ...prev,
      ageMin: val,
      ageMax: Math.max(val, prev.ageMax)
    }));
  };

  const handleAgeMaxChange = (val: number) => {
    setFilters(prev => ({
      ...prev,
      ageMax: val,
      ageMin: Math.min(val, prev.ageMin)
    }));
  };

  // Height validation
  const handleHeightMinChange = (val: number) => {
    setFilters(prev => ({
      ...prev,
      heightMin: val,
      heightMax: Math.max(val, prev.heightMax)
    }));
  };

  const handleHeightMaxChange = (val: number) => {
    setFilters(prev => ({
      ...prev,
      heightMax: val,
      heightMin: Math.min(val, prev.heightMin)
    }));
  };

  const filteredKootams = useMemo(() => {
    return KONGU_KOOTAMS.filter(k =>
      k.toLowerCase().includes(kootamSearch.toLowerCase().trim())
    );
  }, [kootamSearch]);

  const filteredNakshatras = useMemo(() => {
    return NAKSHATRAS.filter(n =>
      n.toLowerCase().includes(nakshatraSearch.toLowerCase().trim())
    );
  }, [nakshatraSearch]);

  // Section badge counts
  const sectionCounts = useMemo(() => {
    return {
      basic: (filters.gender ? 1 : 0) + (filters.maritalStatus.length > 0 ? filters.maritalStatus.length : 0),
      location: filters.locations.length + (filters.nativePlaces?.length || 0),
      education: filters.education.length,
      career: filters.professions.length + (filters.incomeMin > 0 ? 1 : 0),
      community: filters.communities.length + filters.subCastes.length + (filters.gothram ? 1 : 0),
      horoscope: (filters.horoscopeAvailableOnly ? 1 : 0) + filters.dosham.length + (filters.rasis?.length || 0) + (filters.nakshatras?.length || 0),
      lifestyle: filters.foodPreference.length + (filters.smoking !== undefined ? 1 : 0) + (filters.drinking !== undefined ? 1 : 0),
      family: (filters.familyType?.length || 0) + (filters.familyValues?.length || 0),
      trust: (filters.verifiedOnly ? 1 : 0) + (filters.withPhotoOnly ? 1 : 0) + (filters.onlineOnly ? 1 : 0) + (filters.nriOnly ? 1 : 0)
    };
  }, [filters]);

  const filterContent = (
    <div className="space-y-3 text-xs font-semibold">
      {/* ====================================================
          GROUP 1 — BASIC DETAILS
          ==================================================== */}
      <div className="border border-[#EFE6DA] dark:border-amber-500/20 rounded-2xl bg-white dark:bg-[#1A0F12] p-3.5 space-y-3 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[#7A1C2E] dark:text-amber-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>1. Basic Details</span>
            {sectionCounts.basic > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 text-[10px] font-mono">
                {sectionCounts.basic}
              </span>
            )}
          </div>
          {openSections.basic ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {openSections.basic && (
          <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
            {/* Looking For */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1.5">
                Looking For (தேடும் வரன்)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: undefined, label: 'All' },
                  { id: 'female', label: 'Bride (பெண்)' },
                  { id: 'male', label: 'Groom (ஆண்)' }
                ].map(g => (
                  <button
                    key={String(g.id)}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, gender: g.id as Gender | undefined }))}
                    className={`py-1.5 px-2 rounded-xl font-bold border transition text-center text-[11px] cursor-pointer ${
                      filters.gender === g.id
                        ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-2xs'
                        : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-stone-700 dark:text-stone-300">
                <span className="font-bold">Age Range:</span>
                <span className="font-bold text-[#7A1C2E] dark:text-amber-300 font-mono">
                  {filters.ageMin} - {filters.ageMax} Yrs
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-500">Min: {filters.ageMin} yrs</span>
                  <input
                    type="range"
                    min={20}
                    max={45}
                    value={filters.ageMin}
                    onChange={e => handleAgeMinChange(Number(e.target.value))}
                    className="w-full accent-[#7A1C2E]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500">Max: {filters.ageMax} yrs</span>
                  <input
                    type="range"
                    min={21}
                    max={50}
                    value={filters.ageMax}
                    onChange={e => handleAgeMaxChange(Number(e.target.value))}
                    className="w-full accent-[#7A1C2E]"
                  />
                </div>
              </div>
            </div>

            {/* Height Range */}
            <div>
              <div className="flex items-center justify-between mb-1 text-stone-700 dark:text-stone-300">
                <span className="font-bold">Height Range:</span>
                <span className="font-bold text-[#7A1C2E] dark:text-amber-300 font-mono text-[11px]">
                  {filters.heightMin} cm - {filters.heightMax} cm
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="range"
                  min={140}
                  max={180}
                  value={filters.heightMin}
                  onChange={e => handleHeightMinChange(Number(e.target.value))}
                  className="w-full accent-[#7A1C2E]"
                />
                <input
                  type="range"
                  min={160}
                  max={210}
                  value={filters.heightMax}
                  onChange={e => handleHeightMaxChange(Number(e.target.value))}
                  className="w-full accent-[#7A1C2E]"
                />
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1.5">
                Marital Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'never_married', label: 'Never Married' },
                  { id: 'divorced', label: 'Divorced' },
                  { id: 'widowed', label: 'Widowed' },
                  { id: 'separated', label: 'Separated' }
                ].map(m => {
                  const isSelected = filters.maritalStatus.includes(m.id as MaritalStatus);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMaritalStatus(m.id as MaritalStatus)}
                      className={`px-2.5 py-1 rounded-xl font-bold border text-[11px] transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-2xs'
                          : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          GROUP 2 — LOCATION & NATIVE ROOTS
          ==================================================== */}
      <div className="border border-[#EFE6DA] dark:border-amber-500/20 rounded-2xl bg-white dark:bg-[#1A0F12] p-3.5 space-y-2.5 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[#7A1C2E] dark:text-amber-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>2. Location & Native Roots</span>
            {sectionCounts.location > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 text-[10px] font-mono">
                {sectionCounts.location}
              </span>
            )}
          </div>
          {openSections.location ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {openSections.location && (
          <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
            <div>
              <span className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1">
                Districts & Regions (மாவட்டம்)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {LOCATIONS.map(loc => {
                  const isSelected = filters.locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`px-2.5 py-1 rounded-xl font-bold border text-[11px] transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-2xs'
                          : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Native Roots */}
            <div>
              <span className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1">
                Kongu Native Places / பூர்வீகம்
              </span>
              <div className="flex flex-wrap gap-1">
                {NATIVE_PLACES.map(np => {
                  const isSelected = (filters.nativePlaces || []).includes(np) || filters.locations.includes(np);
                  return (
                    <button
                      key={np}
                      type="button"
                      onClick={() => toggleNativePlace(np)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-700 text-white border-amber-700'
                          : 'bg-stone-50 dark:bg-[#140C0E] text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {np}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          GROUP 3 — EDUCATION & DEGREE
          ==================================================== */}
      <div className="border border-[#EFE6DA] dark:border-amber-500/20 rounded-2xl bg-white dark:bg-[#1A0F12] p-3.5 space-y-2.5 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[#7A1C2E] dark:text-amber-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>3. Education & Degree</span>
            {sectionCounts.education > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 text-[10px] font-mono">
                {sectionCounts.education}
              </span>
            )}
          </div>
          {openSections.education ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {openSections.education && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-100 dark:border-stone-800">
            {EDUCATION_OPTIONS.map(edu => {
              const isSelected = filters.education.includes(edu);
              return (
                <button
                  key={edu}
                  type="button"
                  onClick={() => toggleEducation(edu)}
                  className={`px-2.5 py-1 rounded-xl font-bold border text-[11px] transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-2xs'
                      : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  {edu}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ====================================================
          GROUP 4 — PROFESSION & ANNUAL INCOME
          ==================================================== */}
      <div className="border border-[#EFE6DA] dark:border-amber-500/20 rounded-2xl bg-white dark:bg-[#1A0F12] p-3.5 space-y-2.5 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('career')}
          className="w-full flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[#7A1C2E] dark:text-amber-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>4. Profession & Annual Income</span>
            {sectionCounts.career > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 text-[10px] font-mono">
                {sectionCounts.career}
              </span>
            )}
          </div>
          {openSections.career ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {openSections.career && (
          <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
            <div className="flex flex-wrap gap-1.5">
              {PROFESSIONS.map(prof => {
                const isSelected = filters.professions.includes(prof);
                return (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => toggleProfession(prof)}
                    className={`px-2.5 py-1 rounded-xl font-bold border text-[11px] transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-2xs'
                        : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {prof}
                  </button>
                );
              })}
            </div>

            {/* Income Grid */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                Minimum Annual Income (வருமானம்)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Any Income', val: 0 },
                  { label: '₹ 10+ Lakhs', val: 10 },
                  { label: '₹ 15+ Lakhs', val: 15 },
                  { label: '₹ 25+ Lakhs', val: 25 },
                  { label: '₹ 35+ Lakhs', val: 35 },
                  { label: '₹ 50+ Lakhs', val: 50 },
                ].map(inc => (
                  <button
                    key={inc.val}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, incomeMin: inc.val }))}
                    className={`py-1.5 px-2 rounded-xl font-bold border text-center text-[11px] transition cursor-pointer ${
                      filters.incomeMin === inc.val
                        ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                        : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {inc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          GROUP 5 — COMMUNITY & KONGU KOOTAM
          ==================================================== */}
      <div className="border border-[#EFE6DA] dark:border-amber-500/20 rounded-2xl bg-white dark:bg-[#1A0F12] p-3.5 space-y-2.5 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('community')}
          className="w-full flex items-center justify-between font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider text-[11px] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 font-tamil text-[#7A1C2E] dark:text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>5. சமுதாயம் & கொங்கு கூட்டம்</span>
            {sectionCounts.community > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 text-[10px] font-mono">
                {sectionCounts.community}
              </span>
            )}
          </div>
          {openSections.community ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {openSections.community && (
          <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
            {/* Community pills */}
            <div>
              <span className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1">
                Community
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMUNITIES.map(comm => {
                  const isSelected = filters.communities.includes(comm);
                  return (
                    <button
                      key={comm}
                      type="button"
                      onClick={() => toggleCommunity(comm)}
                      className={`px-2.5 py-1 rounded-xl font-bold border text-[11px] transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-2xs'
                          : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {comm}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Kootams */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
                  Kongu Kootam (கூட்டம்)
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  20+ Traditional Lineages
                </span>
              </div>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search Kootam (e.g. Vellode, Sengunni)..."
                  value={kootamSearch}
                  onChange={e => setKootamSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-stone-200/60 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-[#140C0E]">
                {filteredKootams.length > 0 ? (
                  filteredKootams.map(k => {
                    const isSelected = filters.subCastes.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleKootam(k)}
                        className={`px-2.5 py-1 rounded-xl font-bold border text-[11px] transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        {k}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-[11px] text-stone-500 p-2 italic w-full text-center">
                    No matching kootam found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          GROUP 6 — HOROSCOPE, RASI & NAKSHATRA
          ==================================================== */}
      <div className="border border-[#EFE6DA] dark:border-amber-500/20 rounded-2xl bg-white dark:bg-[#1A0F12] p-3.5 space-y-2.5 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('horoscope')}
          className="w-full flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 font-tamil text-[#7A1C2E] dark:text-amber-400 font-bold">
            <Moon className="w-3.5 h-3.5 text-amber-500" />
            <span>6. ஜாதகம் & நட்சத்திரம் (Horoscope)</span>
            {sectionCounts.horoscope > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 text-[10px] font-mono">
                {sectionCounts.horoscope}
              </span>
            )}
          </div>
          {openSections.horoscope ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {openSections.horoscope && (
          <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
            <label className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#140C0E] border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-amber-400">
              <span className="font-bold text-stone-800 dark:text-stone-200">Horoscope Available Only</span>
              <input
                type="checkbox"
                checked={filters.horoscopeAvailableOnly}
                onChange={e => setFilters(prev => ({ ...prev, horoscopeAvailableOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-[#7A1C2E]"
              />
            </label>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1 text-[11px]">
                Dosham Status (தோஷம்)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'no_dosham', label: 'சுத்த ஜாதகம் (No Dosham)' },
                  { id: 'sevvaai_dosham', label: 'செவ்வாய் (Sevvaai)' },
                  { id: 'rahu_ketu_dosham', label: 'ராகு கேது (Rahu-Ketu)' }
                ].map(d => {
                  const isSelected = filters.dosham.includes(d.id as DoshamType);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDosham(d.id as DoshamType)}
                      className={`px-2.5 py-1 rounded-xl font-bold border text-[11px] transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-2xs'
                          : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rasi Selector */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1 text-[11px]">
                Rasi (ராசி)
              </label>
              <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700">
                {RASIS.map(r => {
                  const isSelected = (filters.rasis || []).includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRasi(r)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {r.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nakshatra Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                  Nakshatra / Star (நட்சத்திரம்)
                </span>
                <span className="text-[10px] text-stone-400">27 Stars</span>
              </div>
              <div className="relative mb-1">
                <Search className="w-3 h-3 absolute left-2 top-2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter star..."
                  value={nakshatraSearch}
                  onChange={e => setNakshatraSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-stone-50 dark:bg-[#140C0E] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] focus:outline-hidden"
                />
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700">
                {filteredNakshatras.map(nak => {
                  const isSelected = (filters.nakshatras || []).includes(nak);
                  return (
                    <button
                      key={nak}
                      type="button"
                      onClick={() => toggleNakshatra(nak)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-700 text-white border-amber-700'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {nak}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          GROUP 7 — LIFESTYLE & HABITS
          ==================================================== */}
      <div className="border border-[#EFE6DA] dark:border-amber-500/20 rounded-2xl bg-white dark:bg-[#1A0F12] p-3.5 space-y-2.5 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('lifestyle')}
          className="w-full flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[#7A1C2E] dark:text-amber-400">
            <Coffee className="w-3.5 h-3.5" />
            <span>7. Lifestyle & Diet</span>
            {sectionCounts.lifestyle > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 text-[10px] font-mono">
                {sectionCounts.lifestyle}
              </span>
            )}
          </div>
          {openSections.lifestyle ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {openSections.lifestyle && (
          <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
            <div>
              <span className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1">
                Food Preference (உணவு)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan'] as FoodPreference[]).map(f => {
                  const isSelected = filters.foodPreference.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFood(f)}
                      className={`py-1.5 rounded-xl font-bold border capitalize text-[11px] transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                          : 'bg-stone-50 dark:bg-[#140C0E] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smoking / Drinking */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#140C0E] border border-stone-200 dark:border-stone-700 cursor-pointer">
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">Non-Smoker</span>
                <input
                  type="checkbox"
                  checked={filters.smoking === false}
                  onChange={e => setFilters(prev => ({ ...prev, smoking: e.target.checked ? false : undefined }))}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#140C0E] border border-stone-200 dark:border-stone-700 cursor-pointer">
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">Non-Drinker</span>
                <input
                  type="checkbox"
                  checked={filters.drinking === false}
                  onChange={e => setFilters(prev => ({ ...prev, drinking: e.target.checked ? false : undefined }))}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          GROUP 8 — TRUST & VERIFICATION
          ==================================================== */}
      <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-[#1A0F12] border border-amber-300/60 dark:border-amber-500/20 shadow-xs">
        <span className="block text-[10px] uppercase font-bold text-[#7A1C2E] dark:text-amber-300 mb-1">
          8. Trust, Activity & Global
        </span>

        <label className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#140C0E] border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-emerald-400">
          <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% ID Verified Only
          </span>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={e => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#140C0E] border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-amber-400">
          <span className="font-bold text-stone-800 dark:text-stone-200">With Photos Only</span>
          <input
            type="checkbox"
            checked={filters.withPhotoOnly}
            onChange={e => setFilters(prev => ({ ...prev, withPhotoOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-[#7A1C2E]"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#140C0E] border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-amber-400">
          <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Online Now
          </span>
          <input
            type="checkbox"
            checked={filters.onlineOnly}
            onChange={e => setFilters(prev => ({ ...prev, onlineOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-[#7A1C2E]"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#140C0E] border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-sky-400">
          <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-600" /> NRI / Global Profiles Only
          </span>
          <input
            type="checkbox"
            checked={!!filters.nriOnly}
            onChange={e => setFilters(prev => ({ ...prev, nriOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
          />
        </label>
      </div>

      {/* Save Search Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onSaveSearchModal}
          className="w-full py-2.5 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold rounded-xl border border-amber-300 dark:border-amber-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Save This Search Filter
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar Panel */}
      <aside className="hidden lg:block w-80 shrink-0 bg-white dark:bg-[#1A0F12] rounded-3xl p-5 border border-[#EFE6DA] dark:border-amber-500/20 shadow-md sticky top-24 self-start max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
              Filter Profiles
            </h3>
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold rounded-full text-[10px]">
              {totalMatches} Found
            </span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-stone-500 hover:text-[#7A1C2E] dark:hover:text-amber-400 flex items-center gap-1 font-bold transition cursor-pointer"
            title="Reset all filters to default"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {filterContent}
      </aside>

      {/* Mobile Drawer / Bottom Sheet */}
      {isFilterDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 h-full p-5 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300 border-l border-amber-500/30">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-amber-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <KolamMotif size={20} color="#D4AF37" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
                    Advanced Filters
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold rounded-full text-[10px]">
                    {totalMatches} Matches
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterContent}
            </div>

            <div className="pt-4 mt-6 border-t border-stone-200 dark:border-amber-500/20 flex gap-2 sticky bottom-0 bg-white dark:bg-[#160A0D] py-3 shadow-lg">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={closeFilterDrawer}
                className="flex-1 py-2.5 btn-primary text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                Show {totalMatches} Matches
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
