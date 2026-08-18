import { Conversation, ChatMessage, Profile } from '../types';
import { profileService } from './profileService';
import { notificationService } from './notificationService';

const STORAGE_CHATS_KEY = 'knm_conversations';
const STORAGE_BLOCKED_KEY = 'knm_blocked_profiles';
const STORAGE_REPORTS_KEY = 'knm_reported_profiles';

let memoryConversations: Conversation[] | null = null;
let memoryBlocked: string[] | null = null;

export const ICEBREAKER_TEMPLATES = [
  "Vanakkam! I came across your profile on Kongu Nila Matrimony and found our shared family values and background very inspiring.",
  "Namaskaram! Our family reviewed your horoscope and educational details. We would love to introduce ourselves.",
  "Vanakkam! Would your family be open for an initial introductory phone call this week?",
  "Hello! Pleased to connect with you. Wishing both our families an auspicious start to our conversation."
];

export const chatService = {
  getConversations: (): Conversation[] => {
    if (memoryConversations) {
      return memoryConversations;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_CHATS_KEY);
        if (stored) {
          memoryConversations = JSON.parse(stored);
          return memoryConversations!;
        }
      }
    } catch {
      // ignore
    }
    const profiles = profileService.getProfiles();
    const initialList: Conversation[] = [
      {
        id: 'conv_1',
        partnerProfile: profiles[0], // Sowmya S
        unreadCount: 1,
        lastMessage: 'Vanakkam! Yes, our parents are free this Sunday morning for a phone call.',
        lastMessageTime: '10:45 AM',
        messages: [
          {
            id: 'm1',
            senderId: 'current_user',
            receiverId: profiles[0]?.id || 'p1',
            text: 'Vanakkam Sowmya! I saw that you studied at PSG Tech and work in Data Science at Bosch. My family also resides in Erode / Coimbatore region.',
            timestamp: 'Yesterday, 6:30 PM',
            status: 'read',
          },
          {
            id: 'm2',
            senderId: profiles[0]?.id || 'p1',
            receiverId: 'current_user',
            text: 'Vanakkam Karthik! Pleased to connect with you. Yes, we saw your profile and our parents checked the 10-Porutham charts which matched very well.',
            timestamp: 'Yesterday, 8:15 PM',
            status: 'read',
          },
          {
            id: 'm3',
            senderId: 'current_user',
            receiverId: profiles[0]?.id || 'p1',
            text: 'That is wonderful to hear! Would your family be open for an initial conversation between parents sometime this week?',
            timestamp: 'Today, 9:20 AM',
            status: 'read',
          },
          {
            id: 'm4',
            senderId: profiles[0]?.id || 'p1',
            receiverId: 'current_user',
            text: 'Vanakkam! Yes, our parents are free this Sunday morning for a phone call.',
            timestamp: 'Today, 10:45 AM',
            status: 'delivered',
          }
        ]
      },
      {
        id: 'conv_2',
        partnerProfile: profiles[6] || profiles[2], // Ananya R (CA)
        unreadCount: 0,
        lastMessage: 'Thank you for expressing interest. I will discuss with my father and get back.',
        lastMessageTime: 'Yesterday',
        messages: [
          {
            id: 'm2_1',
            senderId: 'current_user',
            receiverId: profiles[6]?.id || profiles[2]?.id || 'p3',
            text: 'Vanakkam Ananya! Expressing interest from our family in Erode.',
            timestamp: 'Yesterday, 2:10 PM',
            status: 'read',
          },
          {
            id: 'm2_2',
            senderId: profiles[6]?.id || profiles[2]?.id || 'p3',
            receiverId: 'current_user',
            text: 'Thank you for expressing interest. I will discuss with my father and get back.',
            timestamp: 'Yesterday, 5:40 PM',
            status: 'read',
          }
        ]
      }
    ];

    memoryConversations = initialList;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(initialList));
      }
    } catch {
      // ignore
    }

    return initialList;
  },

  sendMessage: (partnerProfile: Profile, text: string): Conversation => {
    const list = [...chatService.getConversations()];
    let convIndex = list.findIndex(
      c => c.partnerProfile.id === partnerProfile.id || c.partnerProfile.profileId === partnerProfile.profileId
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: 'current_user',
      receiverId: partnerProfile.id,
      text: text.trim(),
      timestamp: `Today, ${timeStr}`,
      status: 'sent',
    };

    let conv: Conversation;

    if (convIndex === -1) {
      conv = {
        id: `conv_${Date.now()}`,
        partnerProfile,
        unreadCount: 0,
        lastMessage: text.trim(),
        lastMessageTime: `Today, ${timeStr}`,
        messages: [newMsg],
      };
      list.unshift(conv);
    } else {
      conv = {
        ...list[convIndex],
        messages: [...list[convIndex].messages, newMsg],
        lastMessage: text.trim(),
        lastMessageTime: `Today, ${timeStr}`,
      };
      list.splice(convIndex, 1);
      list.unshift(conv);
    }

    memoryConversations = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return conv;
  },

  markAsRead: (partnerProfileId: string): Conversation[] => {
    const list = [...chatService.getConversations()];
    const convIndex = list.findIndex(
      c => c.partnerProfile.id === partnerProfileId || c.partnerProfile.profileId === partnerProfileId
    );

    if (convIndex >= 0 && list[convIndex].unreadCount > 0) {
      const conv = list[convIndex];
      list[convIndex] = {
        ...conv,
        unreadCount: 0,
        messages: conv.messages.map(m => (m.receiverId === 'current_user' && m.status !== 'read' ? { ...m, status: 'read' as const } : m))
      };
      memoryConversations = list;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(list));
        }
      } catch {
        // ignore
      }
    }
    return list;
  },

  clearConversation: (conversationId: string): Conversation[] => {
    const list = [...chatService.getConversations()];
    const convIndex = list.findIndex(c => c.id === conversationId);
    if (convIndex >= 0) {
      list[convIndex] = {
        ...list[convIndex],
        messages: [],
        lastMessage: 'Conversation cleared',
        lastMessageTime: 'Just now',
        unreadCount: 0,
      };
      memoryConversations = list;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(list));
        }
      } catch {
        // ignore
      }
    }
    return list;
  },

  deleteConversation: (conversationId: string): Conversation[] => {
    const list = chatService.getConversations().filter(c => c.id !== conversationId);
    memoryConversations = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return list;
  },

  getBlockedProfiles: (): string[] => {
    if (memoryBlocked) {
      return memoryBlocked;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_BLOCKED_KEY);
        if (stored) {
          memoryBlocked = JSON.parse(stored);
          return memoryBlocked!;
        }
      }
    } catch {
      // ignore
    }
    memoryBlocked = [];
    return memoryBlocked;
  },

  blockProfile: (profileId: string): string[] => {
    const blocked = [...chatService.getBlockedProfiles()];
    if (!blocked.includes(profileId)) {
      blocked.push(profileId);
      memoryBlocked = blocked;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_BLOCKED_KEY, JSON.stringify(blocked));
        }
      } catch {
        // ignore
      }
    }
    return blocked;
  },

  unblockProfile: (profileId: string): string[] => {
    const blocked = chatService.getBlockedProfiles().filter(id => id !== profileId);
    memoryBlocked = blocked;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_BLOCKED_KEY, JSON.stringify(blocked));
      }
    } catch {
      // ignore
    }
    return blocked;
  },

  isProfileBlocked: (profileId: string): boolean => {
    const blocked = chatService.getBlockedProfiles();
    return blocked.includes(profileId);
  },

  reportProfile: (profileId: string, reason: string, details?: string): boolean => {
    try {
      let reports = [];
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_REPORTS_KEY);
        reports = stored ? JSON.parse(stored) : [];
      }
      reports.push({
        id: `rep_${Date.now()}`,
        profileId,
        reason,
        details: details || '',
        reportedAt: new Date().toISOString()
      });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
      }
      return true;
    } catch {
      return true;
    }
  }
};
