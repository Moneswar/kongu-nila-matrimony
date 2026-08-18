import { Profile, SearchFilterState, SavedSearch, Gender, MaritalStatus, FoodPreference, DoshamType, FamilyType, FamilyValues } from '../types';
import { profileService } from './profileService';
import { matchingService } from './matchingService';
import { chatService } from './chatService';

const STORAGE_SAVED_SEARCHES_KEY = 'knm_saved_searches';
let memorySavedSearches: SavedSearch[] | null = null;

export const defaultSearchFilters: SearchFilterState = {
  gender: undefined,
  ageMin: 21,
  ageMax: 38,
  heightMin: 145,
  heightMax: 200,
  maritalStatus: ['never_married'],
  locations: [],
  nativePlaces: [],
  communities: [],
  subCastes: [],
  gothram: '',
  education: [],
  professions: [],
  incomeMin: 0,
  foodPreference: [],
  smoking: undefined,
  drinking: undefined,
  dosham: [],
  familyType: [],
  familyValues: [],
  rasis: [],
  nakshatras: [],
  withPhotoOnly: false,
  verifiedOnly: false,
  onlineOnly: false,
  horoscopeAvailableOnly: false,
  nriOnly: false,
  minCompatibility: undefined,
  sortBy: 'compatibility',
  searchQuery: '',
};

const initialSavedSearchesList: SavedSearch[] = [
  {
    id: 'ss1',
    title: 'Software & Data Professionals - Coimbatore/Erode',
    dateCreated: '2025-01-15',
    filters: {
      ...defaultSearchFilters,
      locations: ['Coimbatore', 'Erode'],
      professions: ['Software', 'Data'],
      incomeMin: 15,
    },
    matchesCount: 18,
  },
  {
    id: 'ss2',
    title: 'Kongu Vellalar Doctors & Architects',
    dateCreated: '2025-02-02',
    filters: {
      ...defaultSearchFilters,
      communities: ['Kongu Vellalar'],
      professions: ['Doctor', 'Architect'],
    },
    matchesCount: 12,
  },
];

export const searchService = {
  /**
   * Filters and sorts matrimonial profiles based on structured criteria,
   * respecting user blocking, privacy rules, and deterministic compatibility.
   */
  filterProfiles: (filters: SearchFilterState, currentUser?: Profile | null): Profile[] => {
    let profiles = profileService.getProfiles();

    // Filter out current active user from results
    if (currentUser) {
      profiles = profiles.filter(p => p.id !== currentUser.id && p.profileId !== currentUser.profileId);
    }

    // Exclude blocked profiles
    profiles = profiles.filter(p => !chatService.isProfileBlocked(p.id));

    // Calculate deterministic compatibility score if user is available
    if (currentUser) {
      profiles = profiles.map(candidate => ({
        ...candidate,
        compatibility: matchingService.calculateCompatibility(currentUser, candidate)
      }));
    }

    // 1. Gender Filter
    if (filters.gender) {
      profiles = profiles.filter(p => p.gender === filters.gender);
    }

    // 2. Age Range Filter with validation safety
    const minAge = Math.min(filters.ageMin, filters.ageMax);
    const maxAge = Math.max(filters.ageMin, filters.ageMax);
    profiles = profiles.filter(p => p.age >= minAge && p.age <= maxAge);

    // 3. Height Range Filter (cm)
    const minHeight = Math.min(filters.heightMin, filters.heightMax);
    const maxHeight = Math.max(filters.heightMin, filters.heightMax);
    profiles = profiles.filter(p => p.heightCm >= minHeight && p.heightCm <= maxHeight);

    // 4. Marital Status Filter
    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      profiles = profiles.filter(p => filters.maritalStatus.includes(p.maritalStatus));
    }

    // 5. Locations / Districts / Cities
    if (filters.locations && filters.locations.length > 0) {
      profiles = profiles.filter(p =>
        filters.locations.some(loc => {
          const l = loc.toLowerCase().trim();
          return (
            p.district.toLowerCase().includes(l) ||
            p.city.toLowerCase().includes(l) ||
            p.state.toLowerCase().includes(l) ||
            p.country.toLowerCase().includes(l) ||
            p.nativePlace.toLowerCase().includes(l)
          );
        })
      );
    }

    // 6. Native Places Filter
    if (filters.nativePlaces && filters.nativePlaces.length > 0) {
      profiles = profiles.filter(p =>
        filters.nativePlaces!.some(np => p.nativePlace.toLowerCase().includes(np.toLowerCase().trim()))
      );
    }

    // 7. Communities Filter
    if (filters.communities && filters.communities.length > 0) {
      profiles = profiles.filter(p =>
        filters.communities.some(c => {
          if (c === 'Tamil Community (All)') return true;
          return p.community.toLowerCase().includes(c.toLowerCase()) || (p.caste && p.caste.toLowerCase().includes(c.toLowerCase()));
        })
      );
    }

    // 8. Sub-Caste / Kongu Kootam Filter
    if (filters.subCastes && filters.subCastes.length > 0) {
      profiles = profiles.filter(p =>
        filters.subCastes.some(k => {
          const kt = k.toLowerCase().replace('kootam', '').trim();
          return (
            p.subCaste.toLowerCase().includes(kt) ||
            (p.kootamGothram && p.kootamGothram.toLowerCase().includes(kt))
          );
        })
      );
    }

    // 9. Gothram / Kootam search string
    if (filters.gothram && filters.gothram.trim() !== '') {
      const g = filters.gothram.toLowerCase().trim();
      profiles = profiles.filter(p =>
        (p.kootamGothram && p.kootamGothram.toLowerCase().includes(g)) ||
        (p.horoscope?.gothram && p.horoscope.gothram.toLowerCase().includes(g)) ||
        p.subCaste.toLowerCase().includes(g)
      );
    }

    // 10. Education Filter
    if (filters.education && filters.education.length > 0) {
      profiles = profiles.filter(p =>
        filters.education.some(edu => {
          const e = edu.toLowerCase().trim();
          return (
            p.education.toLowerCase().includes(e) ||
            (p.degree && p.degree.toLowerCase().includes(e)) ||
            (p.college && p.college.toLowerCase().includes(e))
          );
        })
      );
    }

    // 11. Profession Filter
    if (filters.professions && filters.professions.length > 0) {
      profiles = profiles.filter(p =>
        filters.professions.some(prof => {
          const pr = prof.toLowerCase().split('/')[0].trim();
          return (
            p.profession.toLowerCase().includes(pr) ||
            (p.designation && p.designation.toLowerCase().includes(pr)) ||
            (p.company && p.company.toLowerCase().includes(pr))
          );
        })
      );
    }

    // 12. Minimum Annual Income Filter (in Lakhs INR)
    if (filters.incomeMin && filters.incomeMin > 0) {
      profiles = profiles.filter(p => (p.annualIncomeNumber || 0) >= filters.incomeMin);
    }

    // 13. Dietary / Food Preference Filter
    if (filters.foodPreference && filters.foodPreference.length > 0) {
      profiles = profiles.filter(p => filters.foodPreference.includes(p.foodPreference));
    }

    // 14. Habits: Smoking & Drinking
    if (filters.smoking !== undefined) {
      profiles = profiles.filter(p => p.smoking === filters.smoking);
    }
    if (filters.drinking !== undefined) {
      profiles = profiles.filter(p => p.drinking === filters.drinking);
    }

    // 15. Family Structure & Values
    if (filters.familyType && filters.familyType.length > 0) {
      profiles = profiles.filter(p => filters.familyType!.includes(p.familyType));
    }
    if (filters.familyValues && filters.familyValues.length > 0) {
      profiles = profiles.filter(p => filters.familyValues!.includes(p.familyValues));
    }

    // 16. Horoscope: Dosham Filter
    if (filters.dosham && filters.dosham.length > 0) {
      profiles = profiles.filter(p => filters.dosham.includes(p.horoscope?.dosham as any));
    }

    // 17. Horoscope: Rasi Filter
    if (filters.rasis && filters.rasis.length > 0) {
      profiles = profiles.filter(p =>
        filters.rasis!.some(r => {
          const rasiShort = r.split(' ')[0].toLowerCase().trim();
          return p.horoscope?.rasi?.toLowerCase().includes(rasiShort);
        })
      );
    }

    // 18. Horoscope: Nakshatra / Star Filter
    if (filters.nakshatras && filters.nakshatras.length > 0) {
      profiles = profiles.filter(p =>
        filters.nakshatras!.some(n => {
          const nak = n.toLowerCase().trim();
          return p.horoscope?.nakshatra?.toLowerCase().includes(nak);
        })
      );
    }

    // 19. Horoscope Available Only
    if (filters.horoscopeAvailableOnly) {
      profiles = profiles.filter(p => p.horoscope && p.horoscope.horoscopeAvailable && !p.horoscopeHidden);
    }

    // 20. With Photo Only
    if (filters.withPhotoOnly) {
      profiles = profiles.filter(p => p.photos && p.photos.length > 0 && p.photoPrivacy === 'public');
    }

    // 21. 100% ID Verified Only
    if (filters.verifiedOnly) {
      profiles = profiles.filter(p => p.isVerified);
    }

    // 22. Online Now Only
    if (filters.onlineOnly) {
      profiles = profiles.filter(p => p.isOnline);
    }

    // 23. NRI Profiles Only
    if (filters.nriOnly) {
      profiles = profiles.filter(
        p =>
          p.country !== 'India' ||
          p.city.includes('USA') ||
          p.city.includes('UK') ||
          p.city.includes('Singapore') ||
          p.city.includes('Dubai') ||
          p.city.includes('Australia') ||
          p.city.includes('London') ||
          p.city.includes('California')
      );
    }

    // 24. Minimum Compatibility Score (e.g. 80%+ or 90%+)
    if (filters.minCompatibility && filters.minCompatibility > 0) {
      profiles = profiles.filter(p => (p.compatibility?.total || 75) >= filters.minCompatibility!);
    }

    // 25. Full Free-Text Search Query (Name, ID, City, Kootam, Star, Profession, Education, etc.)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const tokens = filters.searchQuery.toLowerCase().trim().split(/\s+/);
      profiles = profiles.filter(p => {
        const searchableString = [
          p.name,
          p.profileId,
          p.gender === 'female' ? 'bride பெண்' : 'groom ஆண் மாப்பிள்ளை',
          `${p.age} yrs`,
          p.city,
          p.district,
          p.state,
          p.country,
          p.nativePlace,
          p.profession,
          p.designation,
          p.company,
          p.education,
          p.degree,
          p.college,
          p.income,
          p.community,
          p.subCaste,
          p.kootamGothram,
          p.kulaDeivam,
          p.horoscope?.rasi,
          p.horoscope?.nakshatra,
          p.horoscope?.dosham === 'no_dosham' ? 'suddha jathagam no dosham' : p.horoscope?.dosham,
          p.foodPreference,
          p.familyType,
          p.familyValues,
          p.aboutMe
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return tokens.every(token => searchableString.includes(token));
      });
    }

    // 26. Sorting Options
    profiles.sort((a, b) => {
      if (filters.sortBy === 'compatibility') {
        return (b.compatibility?.total || 80) - (a.compatibility?.total || 80);
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
      }
      if (filters.sortBy === 'recently_active') {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (filters.sortBy === 'age_asc') {
        return a.age - b.age;
      }
      if (filters.sortBy === 'age_desc') {
        return b.age - a.age;
      }
      if (filters.sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      // default: compatibility
      return (b.compatibility?.total || 80) - (a.compatibility?.total || 80);
    });

    return profiles;
  },

  /**
   * Generates a SearchFilterState pre-populated from the user's partner preferences.
   */
  getFiltersFromPartnerPreferences: (user: Profile): SearchFilterState => {
    const prefs = user.partnerPreferences;
    const targetGender: Gender = user.gender === 'male' ? 'female' : 'male';

    if (!prefs) {
      return {
        ...defaultSearchFilters,
        gender: targetGender
      };
    }

    return {
      ...defaultSearchFilters,
      gender: targetGender,
      ageMin: prefs.ageRange ? prefs.ageRange[0] : 21,
      ageMax: prefs.ageRange ? prefs.ageRange[1] : 35,
      heightMin: prefs.heightRange ? prefs.heightRange[0] : 145,
      heightMax: prefs.heightRange ? prefs.heightRange[1] : 200,
      maritalStatus: prefs.maritalStatus && prefs.maritalStatus.length > 0 ? prefs.maritalStatus : ['never_married'],
      locations: prefs.locations || [],
      communities: prefs.communities || [],
      subCastes: prefs.subCastes || [],
      education: prefs.educationLevels || [],
      professions: prefs.professions || [],
      incomeMin: prefs.minAnnualIncome || 0,
      foodPreference: prefs.foodPreference || [],
      familyValues: prefs.familyValues || [],
      rasis: prefs.rasiPreferences || [],
      sortBy: 'compatibility'
    };
  },

  getSavedSearches: (): SavedSearch[] => {
    if (memorySavedSearches) return memorySavedSearches;
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_SAVED_SEARCHES_KEY);
        if (stored) {
          memorySavedSearches = JSON.parse(stored);
          return memorySavedSearches!;
        }
      }
    } catch {
      // ignore
    }
    memorySavedSearches = [...initialSavedSearchesList];
    return memorySavedSearches;
  },

  saveSearch: (title: string, filters: SearchFilterState, matchesCount: number): SavedSearch => {
    const list = [...searchService.getSavedSearches()];
    const newSearch: SavedSearch = {
      id: `ss_${Date.now()}`,
      title,
      dateCreated: new Date().toISOString().split('T')[0],
      filters,
      matchesCount,
    };
    list.unshift(newSearch);
    memorySavedSearches = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_SAVED_SEARCHES_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return newSearch;
  },

  deleteSavedSearch: (id: string): void => {
    const list = searchService.getSavedSearches().filter(s => s.id !== id);
    memorySavedSearches = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_SAVED_SEARCHES_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  }
};
