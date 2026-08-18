import { AppNotification, NotificationPreferences } from '../types';

const STORAGE_NOTIFICATIONS_KEY = 'knm_notifications';
const STORAGE_NOTIF_PREFS_KEY = 'knm_notification_preferences';

let memoryNotifications: AppNotification[] | null = null;
let memoryPreferences: NotificationPreferences | null = null;

const defaultPreferences: NotificationPreferences = {
  inApp: true,
  email: {
    interestReceived: true,
    interestAccepted: true,
    newMessage: true,
    membershipUpdates: true,
    platformAnnouncements: false,
    securityAlerts: true, // Always mandatory
  },
  sms: {
    interestReceived: true,
    interestAccepted: true,
    verificationUpdates: true,
    securityAlerts: true, // Always mandatory
  }
};

const initialNotificationsList: AppNotification[] = [
  {
    id: 'n1',
    type: 'interest',
    title: 'New Interest Received',
    description: 'Sowmya Soundararajan (Data Scientist, Coimbatore) expressed interest in your profile.',
    timestamp: '10 mins ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    linkTo: 'interests',
    priority: 'normal'
  },
  {
    id: 'n2',
    type: 'message',
    title: 'New Message',
    description: 'You have an unread message from Sowmya S: "Vanakkam! Yes, our parents are free..."',
    timestamp: '45 mins ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    linkTo: 'messages',
    priority: 'normal'
  },
  {
    id: 'n3',
    type: 'membership',
    title: 'Assisted VIP Concierge Active',
    description: 'Your Dedicated Relationship Manager Mr. Shanmugam is actively screening verified alliances.',
    timestamp: 'Yesterday, 3:30 PM',
    read: true,
    linkTo: 'membership',
    priority: 'normal'
  },
  {
    id: 'n4',
    type: 'profile_view',
    title: 'Profile Viewed',
    description: 'Dr. Deepa Natarajan (Salem) viewed your detailed matrimonial profile.',
    timestamp: 'Yesterday, 11:00 AM',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80',
    linkTo: 'visitors',
    priority: 'low'
  },
  {
    id: 'n5',
    type: 'horoscope_match',
    title: 'New 10-Porutham Match',
    description: 'A newly registered profile matches 9/10 Poruthams with your birth star.',
    timestamp: '3 days ago',
    read: true,
    linkTo: 'horoscope',
    priority: 'normal'
  },
  {
    id: 'n6',
    type: 'verification',
    title: 'Profile 100% ID Verified',
    description: 'Congratulations! Your Government ID & Mobile verification have been approved.',
    timestamp: '5 days ago',
    read: true,
    linkTo: 'my-profile',
    priority: 'high'
  }
];

export const notificationService = {
  getNotifications: (): AppNotification[] => {
    if (memoryNotifications) {
      return memoryNotifications;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
        if (stored) {
          memoryNotifications = JSON.parse(stored);
          return memoryNotifications!;
        }
      }
    } catch {
      // ignore
    }

    memoryNotifications = [...initialNotificationsList];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(memoryNotifications));
      }
    } catch {
      // ignore
    }
    return memoryNotifications;
  },

  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification => {
    const list = [...notificationService.getNotifications()];
    const newNotif: AppNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    list.unshift(newNotif);
    memoryNotifications = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return newNotif;
  },

  markAsRead: (id: string): AppNotification[] => {
    const list = notificationService.getNotifications().map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    memoryNotifications = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return list;
  },

  markAllAsRead: (): AppNotification[] => {
    const list = notificationService.getNotifications().map(n => ({ ...n, read: true }));
    memoryNotifications = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return list;
  },

  deleteNotification: (id: string): AppNotification[] => {
    const list = notificationService.getNotifications().filter(n => n.id !== id);
    memoryNotifications = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return list;
  },

  getUnreadCount: (): number => {
    return notificationService.getNotifications().filter(n => !n.read).length;
  },

  groupNotifications: (notifications: AppNotification[]): {
    today: AppNotification[];
    yesterday: AppNotification[];
    earlier: AppNotification[];
  } => {
    const today: AppNotification[] = [];
    const yesterday: AppNotification[] = [];
    const earlier: AppNotification[] = [];

    notifications.forEach(n => {
      const ts = n.timestamp.toLowerCase();
      if (ts.includes('min') || ts.includes('hour') || ts.includes('just now') || ts.includes('today')) {
        today.push(n);
      } else if (ts.includes('yesterday') || ts.includes('1 day ago')) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  },

  getNotificationPreferences: (): NotificationPreferences => {
    if (memoryPreferences) {
      return memoryPreferences;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_NOTIF_PREFS_KEY);
        if (stored) {
          memoryPreferences = JSON.parse(stored);
          return memoryPreferences!;
        }
      }
    } catch {
      // ignore
    }
    memoryPreferences = { ...defaultPreferences };
    return memoryPreferences;
  },

  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>): NotificationPreferences => {
    const current = notificationService.getNotificationPreferences();
    const updated: NotificationPreferences = {
      ...current,
      ...prefs,
      email: {
        ...current.email,
        ...(prefs.email || {}),
        securityAlerts: true // Strictly mandatory
      },
      sms: {
        ...current.sms,
        ...(prefs.sms || {}),
        securityAlerts: true // Strictly mandatory
      }
    };
    memoryPreferences = updated;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_NOTIF_PREFS_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
    return updated;
  }
};
