import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMatrimony } from '../context/MatrimonyContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { matchingService } from '../services/matchingService';
import { notificationService } from '../services/notificationService';
import { membershipService } from '../services/membershipService';
import { KolamMotif } from '../components/common/KolamMotif';
import { ProfileCard } from '../components/profile/ProfileCard';
import { AppNotification } from '../types';
import {
  User,
  Heart,
  Bookmark,
  MessageCircle,
  ShieldCheck,
  Crown,
  Sparkles,
  Edit,
  Eye,
  SlidersHorizontal,
  Phone,
  CheckCircle2,
  Lock,
  ArrowRight,
  Compass,
  Briefcase,
  GraduationCap,
  MapPin,
  Check,
  Bell,
  CheckCheck,
  Search,
  Users,
  Clock,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';

interface DashboardViewProps {
  setCurrentTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentTab }) => {
  const { currentUser, toggleDemoUser, profileCompletion } = useAuth();
  const {
    shortlists,
    interests,
    conversations,
    profiles,
    openProfileDetail,
    openChatWith,
    openUpgradeModal
  } = useMatrimony();
  const { t, language } = useLanguage();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationService.getNotifications()
  );
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');

  // Real matching engine calculation from Prompt 10
  const matchResults = matchingService.getRecommendations(currentUser, profiles);
  const recommendedMatches = matchResults.slice(0, 4);

  // Shortlists & Interests derived from real state
  const shortlistedProfiles = profiles.filter(p => shortlists.some(s => s.profileId === p.id));
  const receivedInterests = interests.filter(i => i.toProfileId === 'current_user' && i.status === 'pending');
  const sentInterests = interests.filter(i => i.fromProfileId === 'current_user');
  const acceptedInterests = interests.filter(i => i.status === 'accepted');

  const { score, missing } = profileCompletion;
  const currentPlan = membershipService.getPlanById(currentUser.membershipTier) || {
    id: currentUser.membershipTier,
    name: currentUser.membershipTier === 'classic' ? 'Classic Gold' : currentUser.membershipTier === 'premium' ? 'Premium Diamond' : currentUser.membershipTier === 'assisted' ? 'Assisted Matrimony VIP' : 'Free Basic',
    price: 0,
    durationMonths: 12,
    contactViews: 0
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'ta' ? 'இனிய காலை வணக்கம்' : 'Good Morning';
    if (hour < 17) return language === 'ta' ? 'இனிய மதிய வணக்கம்' : 'Good Afternoon';
    return language === 'ta' ? 'இனிய மாலை வணக்கம்' : 'Good Evening';
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
    showToast('All notifications marked as read', 'info');
  };

  const handleNotificationClick = (notif: AppNotification) => {
    const updated = notificationService.markAsRead(notif.id);
    setNotifications(updated);

    if (notif.linkTo === 'interests') setCurrentTab('interests');
    else if (notif.linkTo === 'messages') setCurrentTab('messages');
    else if (notif.linkTo === 'membership') setCurrentTab('membership');
    else if (notif.linkTo === 'my-profile') setCurrentTab('my-profile');
    else if (notif.linkTo === 'horoscope') setCurrentTab('matches');
    else setCurrentTab('matches');
  };

  const filteredNotifications = notifications.filter(n =>
    notificationFilter === 'unread' ? !n.read : true
  );
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. WELCOME & USER IDENTITY HERO */}
      <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <KolamMotif size={160} color="#F3E5AB" />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative z-10">
          <div className="relative">
            <img
              src={
                currentUser.photos[0] ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
              }
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white flex items-center gap-0.5 shadow-xs">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif-brand text-amber-100">
                {getGreeting()}, {currentUser.name || 'Member'}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-400/40 font-mono font-bold">
                {currentUser.profileId}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
              {currentUser.profession} • {currentUser.city} (Native: {currentUser.nativePlace})
            </p>
            <p className="text-xs text-amber-200/75 max-w-xl">
              Continue your matrimonial journey and discover meaningful connections across Kongu Nadu.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Crown className="w-3.5 h-3.5" />
                {currentPlan.name}
              </span>
              <span className="opacity-40">•</span>
              <span className="text-amber-200 font-tamil">
                {currentUser.subCaste || currentUser.kootamGothram || 'Kongu Vellalar'}
              </span>
              <span className="opacity-40">•</span>
              <span className="text-emerald-400 font-bold">Profile {score}% Complete</span>
            </div>
          </div>
        </div>

        {/* Hero Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 relative z-10">
          <button
            type="button"
            onClick={() => toggleDemoUser()}
            className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-xl text-xs font-bold text-amber-200 transition flex items-center gap-1.5 cursor-pointer"
            title="Switch between Groom & Bride Personas"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Switch Persona</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('membership')}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold rounded-xl text-xs shadow-md hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </div>

      {/* 2. CORE ACTIVITY METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Recommended Matches */}
        <div
          onClick={() => setCurrentTab('matches')}
          className="bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs hover:border-amber-400 cursor-pointer transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold">Matches</span>
            <strong className="text-2xl font-bold text-[#7A1C2E] dark:text-amber-300 group-hover:scale-105 transition-transform inline-block">
              {matchResults.length}
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Received Interests */}
        <div
          onClick={() => setCurrentTab('interests')}
          className="bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs hover:border-rose-400 cursor-pointer transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold">Interests</span>
            <strong className="text-2xl font-bold text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform inline-block">
              {receivedInterests.length}
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current text-rose-600" />
          </div>
        </div>

        {/* Shortlists */}
        <div
          onClick={() => setCurrentTab('shortlists')}
          className="bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs hover:border-amber-400 cursor-pointer transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold">Shortlisted</span>
            <strong className="text-2xl font-bold text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform inline-block">
              {shortlists.length}
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        {/* Messages */}
        <div
          onClick={() => setCurrentTab('messages')}
          className="bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs hover:border-emerald-400 cursor-pointer transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold">Messages</span>
            <strong className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform inline-block">
              {conversations.length}
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Notifications */}
        <div
          onClick={() => {
            const notifSection = document.getElementById('dashboard-notifications-section');
            if (notifSection) notifSection.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xs hover:border-sky-400 cursor-pointer transition flex items-center justify-between group col-span-2 sm:col-span-1"
        >
          <div>
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-bold">Notifications</span>
            <strong className="text-2xl font-bold text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform inline-block">
              {unreadNotifCount}
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. PROFILE COMPLETION PROGRESS & TRUST HEALTH */}
      <div className="bg-white dark:bg-[#1A0F12] p-6 sm:p-7 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Profile Completion ({score}%)</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Profiles with 100% completion and verified ID receive 4x more responses from respectable Kongu families.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('my-profile')}
            className="px-4 py-2 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white font-bold text-xs rounded-xl shadow-md transition shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Complete & Edit Profile</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-amber-500 via-[#7A1C2E] to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(10, score)}%` }}
          />
        </div>

        {/* Verification Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-800 dark:text-emerald-300">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Govt ID Verified</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-800 dark:text-emerald-300">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Mobile & WhatsApp Verified</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-800 dark:text-emerald-300">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">10-Porutham Chart Set</span>
          </div>
          {missing && missing.length > 0 ? (
            <div
              onClick={() => setCurrentTab('my-profile')}
              className="flex items-center justify-between p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 text-amber-900 dark:text-amber-300 cursor-pointer hover:border-amber-400"
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold truncate">{missing[0]}</span>
              </div>
              <span className="text-[10px] font-bold text-[#7A1C2E] dark:text-amber-400 shrink-0">+ Complete</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 text-emerald-800 dark:text-emerald-300">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">100% Profile Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. RECOMMENDED MATCHES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFE6DA] dark:border-stone-800 pb-3">
          <div>
            <h2 className="text-xl font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Recommended Matches for You</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-tamil">
              உங்கள் ஜாதகம், கல்வி மற்றும் கொங்கு முறைப்படி பொருந்தும் வரன்கள்
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('matches')}
            className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recommendedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendedMatches.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1A0F12] p-8 rounded-3xl border border-stone-200 dark:border-stone-800 text-center space-y-3">
            <Search className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-500">No recommended profiles matching current criteria.</p>
            <button
              type="button"
              onClick={() => setCurrentTab('search')}
              className="px-4 py-2 bg-[#7A1C2E] text-white rounded-xl text-xs font-bold"
            >
              Adjust Search Filters
            </button>
          </div>
        )}
      </div>

      {/* 5. DUAL PANEL: NOTIFICATIONS & RECENT CONVERSATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-notifications-section">
        {/* Left Panel: Notification Center */}
        <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Notification Center
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setNotificationFilter('all')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      notificationFilter === 'all'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationFilter('unread')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      notificationFilter === 'unread'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Unread ({unreadNotifCount})
                  </button>
                </div>

                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllNotificationsRead}
                    className="text-[11px] text-[#7A1C2E] dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="divide-y divide-stone-100 dark:divide-stone-800/60 max-h-[360px] overflow-y-auto pt-1">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 rounded-2xl transition flex items-start gap-3 cursor-pointer my-1 ${
                      !notif.read
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-500/20'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    {notif.avatar ? (
                      <img
                        src={notif.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400/40 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-stone-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight line-clamp-2">
                        {notif.description}
                      </p>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-2 text-xs text-stone-500">
                  <CheckCheck className="w-7 h-7 text-emerald-500 mx-auto" />
                  <p>You're all caught up! No unread notifications.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 text-center border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] text-stone-500">
              Notifications update in real time with interest and message activities.
            </span>
          </div>
        </div>

        {/* Right Panel: Recent Conversations & Shortlists */}
        <div className="space-y-6">
          {/* Active Conversations */}
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Recent Conversations
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('messages')}
                className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:underline"
              >
                View Messages ({conversations.length})
              </button>
            </div>

            {conversations.length > 0 ? (
              <div className="space-y-2.5">
                {conversations.slice(0, 3).map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setCurrentTab('messages')}
                    className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 hover:border-emerald-400 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={conv.partnerProfile.photos[0] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
                        alt={conv.partnerProfile.name}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {conv.partnerProfile.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {conv.lastMessage || 'Connected on Kongu Nila Matrimony'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-stone-400 block font-mono">
                        {conv.lastMessageTime || 'Recent'}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-stone-950 text-[9px] font-bold">
                          {conv.unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2 text-xs text-stone-500">
                <MessageCircle className="w-7 h-7 text-stone-400 mx-auto" />
                <p>No active conversations yet. Once interests are accepted, chats will appear here.</p>
              </div>
            )}
          </div>

          {/* Shortlisted Profiles Glance */}
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Your Shortlist ({shortlists.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('shortlists')}
                className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:underline"
              >
                View All
              </button>
            </div>

            {shortlistedProfiles.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {shortlistedProfiles.slice(0, 4).map(p => (
                  <div
                    key={p.id}
                    onClick={() => openProfileDetail(p)}
                    className="p-2 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center gap-2.5 hover:border-amber-400 transition cursor-pointer"
                  >
                    <img
                      src={p.photos[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-amber-400/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {p.name.split(' ')[0]}
                      </h4>
                      <span className="text-[10px] text-stone-500 truncate block">
                        {p.city} • {p.age} Yrs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 space-y-2 text-xs text-stone-500">
                <Bookmark className="w-6 h-6 text-stone-400 mx-auto" />
                <p>Your shortlist is empty. Save candidates to review with family later.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. MEMBERSHIP & PRIVACY SAFETY TRUST BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-[#FAF7F2] dark:from-[#1E1114] dark:to-[#160A0D] p-6 rounded-3xl border-2 border-amber-400/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-4 h-4" />
              <span>Subscription & Verified Contacts</span>
            </div>
            <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              Active Plan: {currentPlan.name}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Includes {currentPlan.contactViews ? `${currentPlan.contactViews} verified phone number unlocks` : 'Standard browsing'} and priority matching.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] text-stone-500 font-mono">
              Valid until 15 May 2025
            </span>
            <button
              type="button"
              onClick={() => setCurrentTab('membership')}
              className="px-4 py-2 bg-[#7A1C2E] text-white rounded-xl text-xs font-bold hover:bg-[#8B1E34] transition cursor-pointer"
            >
              Upgrade / Renew Plan
            </button>
          </div>
        </div>

        {/* Trust & Privacy Health */}
        <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Family Safety & Privacy</span>
            </div>
            <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              Your Privacy Matters
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Control photo visibility, contact requests, and horoscope chart access anytime in your privacy settings.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Strict Matrimonial Privacy Active
            </span>
            <button
              type="button"
              onClick={() => setCurrentTab('safety')}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
