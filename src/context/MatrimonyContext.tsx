import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Profile,
  ShortlistRecord,
  InterestRecord,
  Conversation,
  PrivacySettings,
  MembershipPlan,
  SearchFilterState,
  SavedSearch
} from '../types';
import { matchService, RelationshipStatus } from '../services/matchService';
import { chatService } from '../services/chatService';
import { profileService } from '../services/profileService';
import { searchService, defaultSearchFilters } from '../services/searchService';
import { notificationService } from '../services/notificationService';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

interface MatrimonyContextType {
  profiles: Profile[];
  shortlists: ShortlistRecord[];
  interests: InterestRecord[];
  conversations: Conversation[];
  compareProfiles: Profile[];
  selectedProfileForDetail: Profile | null;
  selectedProfileForChat: Profile | null;
  selectedProfilesForHoroscope: [Profile, Profile] | null;
  searchFilters: SearchFilterState;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  savedSearches: SavedSearch[];
  saveCurrentSearch: (title: string) => void;
  deleteSavedSearch: (id: string) => void;

  // Modals & Drawers
  isDetailModalOpen: boolean;
  isChatDrawerOpen: boolean;
  isCompareModalOpen: boolean;
  isRegistrationModalOpen: boolean;
  isLoginModalOpen: boolean;
  isAssistedModalOpen: boolean;
  isUpgradeModalOpen: boolean;
  isFilterDrawerOpen: boolean;
  isHoroscopeModalOpen: boolean;
  selectedPlanForUpgrade: MembershipPlan | null;

  // Actions
  toggleShortlist: (profile: Profile) => void;
  sendInterest: (profile: Profile, customMessage?: string) => void;
  respondToInterest: (interestId: string, status: 'accepted' | 'declined' | 'withdrawn') => void;
  acceptInterest: (interestId: string) => void;
  declineInterest: (interestId: string) => void;
  withdrawInterest: (interestId: string) => void;
  getRelationshipStatus: (profileId: string) => RelationshipStatus;
  addToCompare: (profile: Profile) => void;
  removeFromCompare: (profileId: string) => void;
  clearCompare: () => void;
  openProfileDetail: (profile: Profile) => void;
  closeProfileDetail: () => void;
  openChatWith: (profile: Profile) => void;
  closeChat: () => void;
  sendMessage: (text: string, overrideProfile?: Profile) => void;
  markConversationAsRead: (partnerProfileId: string) => void;
  clearConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  blockProfile: (profileId: string) => void;
  unblockProfile: (profileId: string) => void;
  reportProfile: (profileId: string, reason: string, details?: string) => void;
  blockedProfileIds: string[];
  unreadMessagesCount: number;
  openHoroscopeMatch: (profile1: Profile, profile2: Profile) => void;
  closeHoroscopeMatch: () => void;

  // Modal Openers
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openAssistedModal: () => void;
  closeAssistedModal: () => void;
  openUpgradeModal: (plan?: MembershipPlan) => void;
  closeUpgradeModal: () => void;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;

  // Preferences & View Mode
  viewMode: 'personal' | 'family';
  setViewMode: (mode: 'personal' | 'family') => void;
  privacySettings: PrivacySettings;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
}

const defaultPrivacy: PrivacySettings = {
  hidePhoneNumber: false,
  hideEmail: false,
  photoVisibility: 'public',
  horoscopeVisibility: 'public',
  profileVisibility: 'all',
  allowVisitorsTracking: true,
  lastSeenVisibility: true,
  blockedProfileIds: [],
  contactAccessPreference: 'anyone',
};

const MatrimonyContext = createContext<MatrimonyContextType | undefined>(undefined);

export const MatrimonyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [profiles] = useState<Profile[]>(() => profileService.getProfiles());
  const [shortlists, setShortlists] = useState<ShortlistRecord[]>(() => matchService.getShortlists());
  const [interests, setInterests] = useState<InterestRecord[]>(() => matchService.getInterests());
  const [conversations, setConversations] = useState<Conversation[]>(() => chatService.getConversations());
  const [compareProfiles, setCompareProfiles] = useState<Profile[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilterState>(defaultSearchFilters);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => searchService.getSavedSearches());

  const [selectedProfileForDetail, setSelectedProfileForDetail] = useState<Profile | null>(null);
  const [selectedProfileForChat, setSelectedProfileForChat] = useState<Profile | null>(null);
  const [selectedProfilesForHoroscope, setSelectedProfilesForHoroscope] = useState<[Profile, Profile] | null>(null);
  const [blockedProfileIds, setBlockedProfileIds] = useState<string[]>(() => chatService.getBlockedProfiles());

  const unreadMessagesCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAssistedModalOpen, setIsAssistedModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isHoroscopeModalOpen, setIsHoroscopeModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<MembershipPlan | null>(null);

  const [viewMode, setViewMode] = useState<'personal' | 'family'>('personal');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => {
    try {
      const saved = localStorage.getItem('knm_privacy');
      return saved ? JSON.parse(saved) : defaultPrivacy;
    } catch {
      return defaultPrivacy;
    }
  });

  const getRelationshipStatus = useCallback((profileId: string): RelationshipStatus => {
    return matchService.getRelationshipStatus(profileId, shortlists, interests, blockedProfileIds);
  }, [shortlists, interests, blockedProfileIds]);

  const saveCurrentSearch = (title: string) => {
    const newSaved: SavedSearch = {
      id: 'ss_' + Date.now(),
      title,
      dateCreated: new Date().toLocaleDateString(),
      filters: searchFilters,
      matchesCount: 12,
    };
    const updated = [newSaved, ...savedSearches];
    setSavedSearches(updated);
    localStorage.setItem('knm_saved_searches', JSON.stringify(updated));
    showToast(`Saved search filter "${title}"`, 'success');
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('knm_saved_searches', JSON.stringify(updated));
    showToast('Saved search removed', 'info');
  };

  const toggleShortlist = (profile: Profile) => {
    const result = matchService.toggleShortlist(profile);
    setShortlists(result.records);
    if (result.added) {
      showToast('Profile added to shortlist.', 'bookmark');
    } else {
      showToast('Profile removed from shortlist.', 'info');
    }
  };

  const sendInterest = (profile: Profile, customMessage?: string) => {
    const { record, isDuplicate, list } = matchService.sendInterest(profile, customMessage);
    setInterests([...list]);

    if (isDuplicate) {
      showToast('Interest already sent and pending.', 'info');
      return;
    }

    showToast('Interest sent successfully.', 'heart');
    
    // Add internal notification record
    notificationService.addNotification({
      type: 'interest',
      title: 'Interest Sent',
      description: `You expressed interest in ${profile.name} (${profile.profileId}).`,
      avatar: profile.photos?.[0],
      linkTo: 'interests'
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#7A1C2E', '#F3E5AB']
      });
    } catch {
      // ignore
    }
  };

  const respondToInterest = (interestId: string, status: 'accepted' | 'declined' | 'withdrawn') => {
    const updated = matchService.respondInterest(interestId, status);
    setInterests([...updated]);

    const targetRecord = updated.find(i => i.id === interestId);
    const partnerName = targetRecord?.profile?.name || 'Partner';

    if (status === 'accepted') {
      showToast("You're now connected.", 'success');
      notificationService.addNotification({
        type: 'interest',
        title: 'You are now connected',
        description: `You and ${partnerName} are now connected. You can start conversation.`,
        avatar: targetRecord?.profile?.photos?.[0],
        linkTo: 'messages'
      });
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#10B981', '#7A1C2E']
        });
      } catch {
        // ignore
      }
    } else if (status === 'withdrawn') {
      showToast('Interest withdrawn.', 'info');
    } else {
      showToast('Interest declined.', 'info');
    }
  };

  const acceptInterest = (interestId: string) => respondToInterest(interestId, 'accepted');
  const declineInterest = (interestId: string) => respondToInterest(interestId, 'declined');
  const withdrawInterest = (interestId: string) => respondToInterest(interestId, 'withdrawn');

  const addToCompare = (profile: Profile) => {
    if (compareProfiles.some(p => p.id === profile.id)) {
      showToast('Profile already in comparison list.', 'info');
      return;
    }
    if (compareProfiles.length >= 3) {
      showToast('You can compare a maximum of 3 profiles at once.', 'error');
      return;
    }
    setCompareProfiles(prev => [...prev, profile]);
    showToast(`Added ${profile.name} to Compare.`, 'success');
  };

  const removeFromCompare = (profileId: string) => {
    setCompareProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const clearCompare = () => {
    setCompareProfiles([]);
  };

  const openProfileDetail = (profile: Profile) => {
    setSelectedProfileForDetail(profile);
    setIsDetailModalOpen(true);
  };

  const closeProfileDetail = () => {
    setIsDetailModalOpen(false);
  };

  const openChatWith = (profile: Profile) => {
    setSelectedProfileForChat(profile);
    setIsChatDrawerOpen(true);
  };

  const closeChat = () => {
    setIsChatDrawerOpen(false);
  };

  const sendMessage = (text: string, overrideProfile?: Profile) => {
    const target = overrideProfile || selectedProfileForChat;
    if (!target) return;
    chatService.sendMessage(target, text);
    setConversations(chatService.getConversations());
    showToast('Message sent successfully.', 'success');
  };

  const markConversationAsRead = (partnerProfileId: string) => {
    const updated = chatService.markAsRead(partnerProfileId);
    setConversations([...updated]);
  };

  const clearConversation = (conversationId: string) => {
    const updated = chatService.clearConversation(conversationId);
    setConversations([...updated]);
    showToast('Conversation cleared.', 'info');
  };

  const deleteConversation = (conversationId: string) => {
    const updated = chatService.deleteConversation(conversationId);
    setConversations([...updated]);
    showToast('Conversation deleted.', 'info');
  };

  const blockProfile = (profileId: string) => {
    const updated = chatService.blockProfile(profileId);
    setBlockedProfileIds([...updated]);
    showToast('Profile has been blocked. You will not receive messages.', 'info');
  };

  const unblockProfile = (profileId: string) => {
    const updated = chatService.unblockProfile(profileId);
    setBlockedProfileIds([...updated]);
    showToast('Profile unblocked successfully.', 'success');
  };

  const reportProfile = (profileId: string, reason: string, details?: string) => {
    chatService.reportProfile(profileId, reason, details);
    showToast('Thank you. Our Trust & Safety team has received your report.', 'success');
  };

  const openHoroscopeMatch = (profile1: Profile, profile2: Profile) => {
    setSelectedProfilesForHoroscope([profile1, profile2]);
    setIsHoroscopeModalOpen(true);
  };

  const closeHoroscopeMatch = () => {
    setIsHoroscopeModalOpen(false);
  };

  const openRegistrationModal = () => setIsRegistrationModalOpen(true);
  const closeRegistrationModal = () => setIsRegistrationModalOpen(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openAssistedModal = () => setIsAssistedModalOpen(true);
  const closeAssistedModal = () => setIsAssistedModalOpen(false);

  const openUpgradeModal = (plan?: MembershipPlan) => {
    setSelectedPlanForUpgrade(plan || null);
    setIsUpgradeModalOpen(true);
  };
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  const openFilterDrawer = () => setIsFilterDrawerOpen(true);
  const closeFilterDrawer = () => setIsFilterDrawerOpen(false);

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setPrivacySettings(prev => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('knm_privacy', JSON.stringify(updated));
      return updated;
    });
    showToast('Privacy & Security settings saved.', 'success');
  };

  return (
    <MatrimonyContext.Provider
      value={{
        profiles,
        shortlists,
        interests,
        conversations,
        compareProfiles,
        selectedProfileForDetail,
        selectedProfileForChat,
        selectedProfilesForHoroscope,
        searchFilters,
        setSearchFilters,
        savedSearches,
        saveCurrentSearch,
        deleteSavedSearch,
        isDetailModalOpen,
        isChatDrawerOpen,
        isCompareModalOpen,
        isRegistrationModalOpen,
        isLoginModalOpen,
        isAssistedModalOpen,
        isUpgradeModalOpen,
        isFilterDrawerOpen,
        isHoroscopeModalOpen,
        selectedPlanForUpgrade,
        toggleShortlist,
        sendInterest,
        respondToInterest,
        acceptInterest,
        declineInterest,
        withdrawInterest,
        getRelationshipStatus,
        addToCompare,
        removeFromCompare,
        clearCompare,
        openProfileDetail,
        closeProfileDetail,
        openChatWith,
        closeChat,
        sendMessage,
        markConversationAsRead,
        clearConversation,
        deleteConversation,
        blockProfile,
        unblockProfile,
        reportProfile,
        blockedProfileIds,
        unreadMessagesCount,
        openHoroscopeMatch,
        closeHoroscopeMatch,
        openRegistrationModal,
        closeRegistrationModal,
        openLoginModal,
        closeLoginModal,
        openAssistedModal,
        closeAssistedModal,
        openUpgradeModal,
        closeUpgradeModal,
        openFilterDrawer,
        closeFilterDrawer,
        viewMode,
        setViewMode,
        privacySettings,
        updatePrivacySettings,
      }}
    >
      {children}
    </MatrimonyContext.Provider>
  );
};

export const useMatrimony = (): MatrimonyContextType => {
  const context = useContext(MatrimonyContext);
  if (!context) {
    throw new Error('useMatrimony must be used within a MatrimonyProvider');
  }
  return context;
};
