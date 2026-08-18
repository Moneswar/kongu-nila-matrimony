import { Profile, SearchFilterState, ShortlistRecord, InterestRecord } from '../types';
import { mockProfiles } from '../data/mockProfiles';

// Local storage keys for state persistence
const STORAGE_PROFILES_KEY = 'knm_profiles';
const STORAGE_CURRENT_USER_KEY = 'knm_current_user';
const STORAGE_SHORTLISTS_KEY = 'knm_shortlists';
const STORAGE_INTERESTS_KEY = 'knm_interests';

export const profileService = {
  getProfiles: (): Profile[] => {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return mockProfiles;
  },

  getProfileById: (id: string): Profile | undefined => {
    const profiles = profileService.getProfiles();
    return profiles.find(p => p.id === id || p.profileId === id);
  },

  updateProfile: (updated: Profile): Profile => {
    const profiles = profileService.getProfiles();
    const index = profiles.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      profiles[index] = updated;
      try {
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
      } catch {
        // ignore
      }
    }
    return updated;
  },

  getCurrentUser: (): Profile => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default demo user: Dr. Karthik S / Gowtham
    return mockProfiles[1]; // Karthik Subramanian
  },

  setCurrentUser: (user: Profile): void => {
    try {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  },

  // Calculate profile completion percentage and actionable missing items
  getProfileCompletion: (user: Profile): { score: number; missing: string[]; missingSections: { title: string; sectionKey: string; actionText: string }[] } => {
    const missing: string[] = [];
    const missingSections: { title: string; sectionKey: string; actionText: string }[] = [];
    let completedPoints = 0;
    const totalPoints = 100;

    // Photos (15 pts)
    if (user.photos && user.photos.length >= 3) {
      completedPoints += 15;
    } else if (user.photos && user.photos.length >= 1) {
      completedPoints += 10;
      missing.push('Add more photos (3+ recommended)');
      missingSections.push({ title: 'Add more photos', sectionKey: 'photos', actionText: 'Upload Photos' });
    } else {
      missing.push('Add profile photo');
      missingSections.push({ title: 'Add profile photo', sectionKey: 'photos', actionText: 'Upload Photos' });
    }

    // Basic Info (15 pts)
    if (user.name && user.age && user.height && user.maritalStatus && user.nativePlace) {
      completedPoints += 15;
    } else {
      completedPoints += 8;
      missing.push('Complete basic & native details');
      missingSections.push({ title: 'Complete basic details', sectionKey: 'basic', actionText: 'Edit Basic Info' });
    }

    // About Me (10 pts)
    if (user.aboutMe && user.aboutMe.trim().length >= 40) {
      completedPoints += 10;
    } else {
      missing.push('Write about yourself (min 40 chars)');
      missingSections.push({ title: 'Write About Me', sectionKey: 'about', actionText: 'Write About Me' });
    }

    // Education & Career (15 pts)
    if (user.education && user.profession && user.company && user.income) {
      completedPoints += 15;
    } else if (user.education && user.profession) {
      completedPoints += 10;
      missing.push('Add company & annual income');
      missingSections.push({ title: 'Add company & income', sectionKey: 'career', actionText: 'Complete Career' });
    } else {
      missing.push('Add education & career details');
      missingSections.push({ title: 'Add education & career', sectionKey: 'career', actionText: 'Complete Career' });
    }

    // Family details (15 pts)
    if (user.aboutFamily && user.fatherOccupation && user.motherOccupation && user.familyType && user.kootamGothram) {
      completedPoints += 15;
    } else if (user.fatherOccupation || user.aboutFamily) {
      completedPoints += 10;
      missing.push('Add full family details (Parents, Kootam & Values)');
      missingSections.push({ title: 'Add family details', sectionKey: 'family', actionText: 'Complete Family' });
    } else {
      missing.push('Add family details & values');
      missingSections.push({ title: 'Add family details', sectionKey: 'family', actionText: 'Complete Family' });
    }

    // Lifestyle & Hobbies (10 pts)
    if (user.foodPreference && user.hobbies && user.hobbies.length >= 2) {
      completedPoints += 10;
    } else if (user.foodPreference) {
      completedPoints += 5;
      missing.push('Add hobbies and language skills');
      missingSections.push({ title: 'Add hobbies & lifestyle', sectionKey: 'lifestyle', actionText: 'Add Hobbies' });
    } else {
      missing.push('Add lifestyle & diet preference');
      missingSections.push({ title: 'Add lifestyle & diet', sectionKey: 'lifestyle', actionText: 'Add Lifestyle' });
    }

    // Horoscope (10 pts)
    if (user.horoscope && user.horoscope.rasi && user.horoscope.nakshatra && user.horoscope.birthPlace) {
      completedPoints += 10;
    } else {
      missing.push('Add birth chart & horoscope details');
      missingSections.push({ title: 'Complete horoscope details', sectionKey: 'horoscope', actionText: 'Add Horoscope' });
    }

    // Partner Preferences (10 pts)
    if (user.partnerPreferences && user.partnerPreferences.locations && user.partnerPreferences.locations.length > 0) {
      completedPoints += 10;
    } else {
      missing.push('Complete partner preferences');
      missingSections.push({ title: 'Complete partner preferences', sectionKey: 'preferences', actionText: 'Set Preferences' });
    }

    const score = Math.min(100, completedPoints);
    return { score, missing, missingSections };
  }
};
