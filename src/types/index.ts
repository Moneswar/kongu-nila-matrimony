export type Gender = 'male' | 'female';
export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'separated';
export type ProfileCreatedFor = 'myself' | 'son' | 'daughter' | 'brother' | 'sister' | 'relative' | 'friend';
export type FoodPreference = 'vegetarian' | 'non_vegetarian' | 'eggetarian' | 'vegan';
export type FamilyType = 'nuclear' | 'joint';
export type FamilyValues = 'traditional' | 'moderate' | 'liberal';
export type DoshamType = 'no_dosham' | 'sevvaai_dosham' | 'rahu_ketu_dosham' | 'kala_sarpa' | 'dont_know';

export interface HoroscopeInfo {
  rasi: string;
  nakshatra: string;
  padam?: number;
  lagnam?: string;
  birthPlace: string;
  birthDate: string;
  birthTime: string;
  dosham: DoshamType;
  horoscopeAvailable: boolean;
  rasiChart?: string[]; // 12 houses
  navamsaChart?: string[];
  kulaDeivam?: string;
  gothram?: string;
  poruthamScore?: number; // 0 - 10 Poruthams
}

export interface CompatibilityScore {
  total: number;
  partnerPreference: number;
  location: number;
  education: number;
  career?: number;
  lifestyle: number;
  family?: number;
  cultural?: number;
  interests?: number;
  reasons: string[];
}

export interface Profile {
  id: string;
  profileId: string; // e.g., KNM-2048
  name: string;
  gender: Gender;
  age: number;
  dateOfBirth: string;
  height: string; // e.g., "5 ft 8 in / 173 cm"
  heightCm: number;
  maritalStatus: MaritalStatus;
  createdFor: ProfileCreatedFor;
  
  // Location
  country: string;
  state: string;
  district: string;
  city: string;
  nativePlace: string;
  distanceKm?: number;

  // Cultural & Community
  religion: string;
  community: string; // e.g., "Kongu Vellalar", "Tamil Community", "Kongu Chettiar"
  caste: string;
  subCaste: string;
  motherTongue: string;
  kulaDeivam?: string;
  kootamGothram?: string;

  // Education & Career
  education: string;
  degree: string;
  college: string;
  institution?: string;
  profession: string;
  designation: string;
  company: string;
  industry?: string;
  income: string; // e.g., "₹ 18 - 22 Lakhs / yr"
  annualIncomeNumber: number; // in INR lakhs

  // Lifestyle
  foodPreference: FoodPreference;
  smoking: boolean;
  drinking: boolean;
  hobbies: string[];
  interests: string[];
  languages?: string[];

  // Family
  fatherName?: string;
  fatherOccupation: string;
  motherName?: string;
  motherOccupation: string;
  brothersCount: number;
  brothersMarried: number;
  sistersCount: number;
  sistersMarried: number;
  familyType: FamilyType;
  familyValues: FamilyValues;
  familyLocation: string;
  familyStatus: 'middle_class' | 'upper_middle_class' | 'affluent' | 'high_net_worth';
  aboutFamily: string;

  // About
  aboutMe: string;

  // Horoscope
  horoscope: HoroscopeInfo;
  horoscopeHidden?: boolean;

  // Partner Preferences
  partnerPreferences?: PartnerPreferences;

  // Photos & Media
  photos: string[];
  photoCaptions?: Record<string, string>;
  photoPrivacy: 'public' | 'members_only' | 'on_request';
  avatarBlur?: boolean;
  privacySettings?: PrivacySettings;

  // Trust & Verification
  isVerified: boolean;
  verificationBadges: {
    mobile: boolean;
    email: boolean;
    photo: boolean;
    idGovt: boolean;
    horoscopeVerified: boolean;
  };
  trustScore: number; // 0-100

  // Activity & Meta
  isOnline: boolean;
  lastActive: string;
  viewsCount: number;
  interestsReceivedCount: number;
  registeredDate: string;
  membershipTier: 'free' | 'classic' | 'premium' | 'assisted';

  // Contact Info (Protected)
  phoneNumber?: string;
  email?: string;
  contactViewAllowed?: boolean;

  // Compatibility (calculated against current active user)
  compatibility?: CompatibilityScore;
}

export interface PartnerPreferences {
  ageRange: [number, number];
  heightRange: [number, number]; // in cm
  maritalStatus: MaritalStatus[];
  communities: string[];
  subCastes: string[];
  locations: string[];
  educationLevels: string[];
  professions: string[];
  minAnnualIncome: number; // in Lakhs
  foodPreference: FoodPreference[];
  doshamAcceptable: boolean;
  rasiPreferences?: string[];
  familyValues?: FamilyValues[];
}

export interface SearchFilterState {
  gender?: Gender;
  ageMin: number;
  ageMax: number;
  heightMin: number;
  heightMax: number;
  maritalStatus: MaritalStatus[];
  locations: string[];
  nativePlaces?: string[];
  communities: string[];
  subCastes: string[];
  gothram?: string;
  education: string[];
  professions: string[];
  incomeMin: number;
  foodPreference: FoodPreference[];
  smoking?: boolean;
  drinking?: boolean;
  dosham: DoshamType[];
  familyType?: FamilyType[];
  familyValues?: FamilyValues[];
  rasis?: string[];
  nakshatras?: string[];
  withPhotoOnly: boolean;
  verifiedOnly: boolean;
  onlineOnly: boolean;
  horoscopeAvailableOnly: boolean;
  nriOnly?: boolean;
  minCompatibility?: number;
  sortBy: 'relevance' | 'compatibility' | 'newest' | 'recently_active' | 'distance' | 'age_asc' | 'age_desc';
  searchQuery?: string;
}

export interface SavedSearch {
  id: string;
  title: string;
  dateCreated: string;
  filters: SearchFilterState;
  matchesCount: number;
}

export interface InterestRecord {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  profile: Profile;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  sentAt: string;
  updatedAt: string;
  message?: string;
}

export interface ShortlistRecord {
  id: string;
  profileId: string;
  profile: Profile;
  addedAt: string;
  notes?: string;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isIcebreaker?: boolean;
}

export interface Conversation {
  id: string;
  partnerProfile: Profile;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type: 'interest' | 'interest_accepted' | 'message' | 'profile_view' | 'shortlist' | 'horoscope_match' | 'system' | 'verification' | 'membership' | 'security';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  linkTo?: string;
  priority?: 'high' | 'normal' | 'low';
}

export interface NotificationPreferences {
  inApp: boolean;
  email: {
    interestReceived: boolean;
    interestAccepted: boolean;
    newMessage: boolean;
    membershipUpdates: boolean;
    platformAnnouncements: boolean;
    securityAlerts: boolean; // Mandatory (locked)
  };
  sms: {
    interestReceived: boolean;
    interestAccepted: boolean;
    verificationUpdates: boolean;
    securityAlerts: boolean; // Mandatory (locked)
  };
}

export interface ProfileVisitor {
  id: string;
  profile: Profile;
  visitedAt: string;
  viewCount: number;
}

export interface SuccessStory {
  id: string;
  coupleNames: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  location: string;
  story: string;
  image: string;
  quote: string;
  engagementYear: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleTa?: string;
  category: 'Tamil Wedding Traditions' | 'Horoscope & Astrology' | 'Relationship Guidance' | 'Family & Matrimony' | 'Safety & Privacy';
  summary: string;
  content: string;
  author: string;
  readTime: string;
  publishedDate: string;
  image: string;
  tags: string[];
}

export interface MembershipPlan {
  id: 'free' | 'classic' | 'premium' | 'assisted';
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  durationMonths: number;
  badge?: string;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
  }[];
  contactViews: number;
  messagingLimit: string;
  horoscopeViews: string;
  dedicatedManager: boolean;
}

export interface PrivacySettings {
  hidePhoneNumber: boolean;
  hideEmail: boolean;
  photoVisibility: 'public' | 'members_only' | 'on_request';
  horoscopeVisibility: 'public' | 'members_only' | 'on_request';
  profileVisibility: 'all' | 'verified_only' | 'hidden';
  allowVisitorsTracking: boolean;
  lastSeenVisibility: boolean;
  blockedProfileIds: string[];
  contactAccessPreference: 'anyone' | 'interests_accepted_only' | 'premium_only';
}

export interface UserNotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  newMatches: boolean;
  interestsReceived: boolean;
  messages: boolean;
  profileViews: boolean;
  weeklyDigest: boolean;
}
