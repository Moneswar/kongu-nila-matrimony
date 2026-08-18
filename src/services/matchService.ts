import { InterestRecord, ShortlistRecord, Profile } from '../types';
import { profileService } from './profileService';

const STORAGE_SHORTLISTS_KEY = 'knm_shortlists';
const STORAGE_INTERESTS_KEY = 'knm_interests';

let memoryShortlists: ShortlistRecord[] | null = null;
let memoryInterests: InterestRecord[] | null = null;

export type RelationshipInterestStatus = 'none' | 'sent_pending' | 'received_pending' | 'connected' | 'declined';

export interface RelationshipStatus {
  isShortlisted: boolean;
  interestStatus: RelationshipInterestStatus;
  interestRecord?: InterestRecord;
  isBlocked: boolean;
  canMessage: boolean;
}

export const matchService = {
  getShortlists: (): ShortlistRecord[] => {
    if (memoryShortlists) {
      return memoryShortlists;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_SHORTLISTS_KEY);
        if (stored) {
          memoryShortlists = JSON.parse(stored);
          return memoryShortlists!;
        }
      }
    } catch {
      // ignore
    }
    const profiles = profileService.getProfiles();
    memoryShortlists = [
      {
        id: 'sl1',
        profileId: profiles[0]?.id || 'p1',
        profile: profiles[0],
        addedAt: '2025-01-20',
        notes: 'Excellent academic background (PSG Tech / SUNY Buffalo)',
        tags: ['Highly Compatible', 'Vegetarian', 'Kongu Vellalar'],
      },
      {
        id: 'sl2',
        profileId: profiles[2]?.id || 'p3',
        profile: profiles[2],
        addedAt: '2025-02-01',
        notes: 'Doctor family from Salem, 9/10 Porutham match',
        tags: ['Doctor', 'Salem Native'],
      }
    ];
    return memoryShortlists;
  },

  toggleShortlist: (profile: Profile, notes?: string): { added: boolean; records: ShortlistRecord[] } => {
    let list = [...matchService.getShortlists()];
    const existsIndex = list.findIndex(
      item => item.profileId === profile.id || item.profile?.profileId === profile.profileId || item.profile?.id === profile.id
    );
    let added = false;

    if (existsIndex >= 0) {
      list = list.filter((_, idx) => idx !== existsIndex);
      added = false;
    } else {
      // Prevent duplicates: filter out any existing entry with same profileId
      list = list.filter(
        item => item.profileId !== profile.id && item.profile?.profileId !== profile.profileId && item.profile?.id !== profile.id
      );
      const record: ShortlistRecord = {
        id: `sl_${Date.now()}`,
        profileId: profile.id,
        profile,
        addedAt: new Date().toISOString().split('T')[0],
        notes: notes || '',
        tags: ['Shortlisted'],
      };
      list.unshift(record);
      added = true;
    }

    memoryShortlists = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_SHORTLISTS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return { added, records: list };
  },

  isShortlisted: (profileId: string): boolean => {
    const list = matchService.getShortlists();
    return list.some(item => item.profileId === profileId || item.profile?.profileId === profileId || item.profile?.id === profileId);
  },

  getInterests: (): InterestRecord[] => {
    if (memoryInterests) {
      return memoryInterests;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_INTERESTS_KEY);
        if (stored) {
          memoryInterests = JSON.parse(stored);
          return memoryInterests!;
        }
      }
    } catch {
      // ignore
    }
    const profiles = profileService.getProfiles();
    memoryInterests = [
      {
        id: 'int_rec_1',
        fromProfileId: profiles[1]?.id || 'p2',
        toProfileId: 'current_user',
        profile: profiles[1],
        status: 'pending',
        sentAt: 'Yesterday, 4:30 PM',
        updatedAt: 'Yesterday, 4:30 PM',
        message: 'Hello! Our family went through your profile and found your background and family values deeply aligned. We would be happy to take the conversation forward.',
      },
      {
        id: 'int_rec_2',
        fromProfileId: profiles[3]?.id || 'p4',
        toProfileId: 'current_user',
        profile: profiles[3],
        status: 'accepted',
        sentAt: '3 days ago',
        updatedAt: '2 days ago',
        message: 'Namaskaram! Expressing interest from our family in Namakkal.',
      },
      {
        id: 'int_sent_1',
        fromProfileId: 'current_user',
        toProfileId: profiles[5]?.id || 'p6',
        profile: profiles[5],
        status: 'pending',
        sentAt: '2 days ago',
        updatedAt: '2 days ago',
        message: 'We are very impressed with your profile and CA career in Adyar, Chennai.',
      }
    ];
    return memoryInterests;
  },

  sendInterest: (toProfile: Profile, message?: string): { record: InterestRecord; isDuplicate: boolean; list: InterestRecord[] } => {
    let list = [...matchService.getInterests()];
    
    // Check if an active interest already exists to prevent duplicates
    const existing = list.find(
      i => (i.toProfileId === toProfile.id || i.profile?.profileId === toProfile.profileId || i.profile?.id === toProfile.id) &&
           i.fromProfileId === 'current_user'
    );

    if (existing) {
      return { record: existing, isDuplicate: true, list };
    }

    const record: InterestRecord = {
      id: `int_${Date.now()}`,
      fromProfileId: 'current_user',
      toProfileId: toProfile.id,
      profile: toProfile,
      status: 'pending',
      sentAt: 'Just now',
      updatedAt: 'Just now',
      message: message || 'We are interested in your profile and would like to connect.',
    };

    list.unshift(record);
    memoryInterests = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_INTERESTS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }

    return { record, isDuplicate: false, list };
  },

  respondInterest: (interestId: string, status: 'accepted' | 'declined' | 'withdrawn'): InterestRecord[] => {
    let list = [...matchService.getInterests()];
    const itemIndex = list.findIndex(i => i.id === interestId);
    if (itemIndex >= 0) {
      list[itemIndex] = {
        ...list[itemIndex],
        status,
        updatedAt: 'Just now'
      };
      memoryInterests = list;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_INTERESTS_KEY, JSON.stringify(list));
        }
      } catch {
        // ignore
      }
    }
    return list;
  },

  withdrawInterest: (interestId: string): InterestRecord[] => {
    return matchService.respondInterest(interestId, 'withdrawn');
  },

  hasInterestSent: (profileId: string): boolean => {
    const list = matchService.getInterests();
    return list.some(
      i => (i.toProfileId === profileId || i.profile?.profileId === profileId || i.profile?.id === profileId) &&
           i.fromProfileId === 'current_user' &&
           (i.status === 'pending' || i.status === 'accepted')
    );
  },

  /**
   * Centralized Relationship Status Calculator
   * Returns consistent relationship state for any target candidate profile.
   */
  getRelationshipStatus: (
    targetProfileId: string,
    shortlistsList: ShortlistRecord[] = matchService.getShortlists(),
    interestsList: InterestRecord[] = matchService.getInterests(),
    blockedIdsList: string[] = []
  ): RelationshipStatus => {
    const isBlocked = blockedIdsList.includes(targetProfileId);
    const isShortlisted = (shortlistsList || []).some(
      s => s.profileId === targetProfileId || s.profile?.profileId === targetProfileId || s.profile?.id === targetProfileId
    );

    const record = interestsList.find(
      i => (i.toProfileId === targetProfileId && i.fromProfileId === 'current_user') ||
           (i.fromProfileId === targetProfileId && i.toProfileId === 'current_user') ||
           (i.profile?.id === targetProfileId) ||
           (i.profile?.profileId === targetProfileId)
    );

    let interestStatus: RelationshipInterestStatus = 'none';

    if (record) {
      if (record.status === 'accepted') {
        interestStatus = 'connected';
      } else if (record.status === 'declined') {
        interestStatus = 'declined';
      } else if (record.status === 'pending') {
        if (record.fromProfileId === 'current_user') {
          interestStatus = 'sent_pending';
        } else {
          interestStatus = 'received_pending';
        }
      }
    }

    const canMessage = !isBlocked && interestStatus === 'connected';

    return {
      isShortlisted,
      interestStatus,
      interestRecord: record,
      isBlocked,
      canMessage
    };
  }
};
