import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMatrimony } from '../../context/MatrimonyContext';
import { KolamMotif } from './KolamMotif';
import {
  Search,
  Heart,
  Bookmark,
  MessageCircle,
  Sun,
  Moon,
  Globe,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Crown,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  Phone,
  BookOpen,
  Users,
  CheckCircle2,
  Bell,
  CheckCheck
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, toggleDemoUser, logout } = useAuth();
  const {
    shortlists,
    interests,
    conversations,
    openRegistrationModal,
    openLoginModal
  } = useMatrimony();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pendingInterestsCount = interests.filter(
    i => i.status === 'pending' && i.toProfileId === 'current_user'
  ).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navLinks = [
    { id: 'home', label: t('navHome') || 'Home' },
    { id: 'search', label: t('navSearch') || 'Search' },
    { id: 'matches', label: t('navMatches') || 'Matches' },
    { id: 'stories', label: 'Stories' },
    { id: 'membership', label: t('navMembership') || 'Membership' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const isLinkActive = (linkId: string) => {
    if (linkId === 'stories' && (currentTab === 'stories' || currentTab === 'success-stories')) {
      return true;
    }
    return currentTab === linkId;
  };

  return (
    <header
      id="global-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0E0608]/98 border-b border-amber-500/30 shadow-2xl backdrop-blur-xl'
          : 'bg-[#12080B]/95 border-b border-amber-500/20 shadow-lg backdrop-blur-md'
      }`}
    >
      {/* 1. TOP ANNOUNCEMENT / BRAND RIBBON */}
      <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] border-b border-amber-500/30 text-amber-100 text-[11px] py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide">
              {language === 'ta'
                ? 'கொங்கு மற்றும் தமிழ் சமூகத்தின் நம்பிக்கைக்குரிய திருமண தளம்'
                : 'Exclusive & Verified Matrimony for Kongu Vellalar & Tamil Community'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full text-[10px] text-amber-300 border border-amber-400/30">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold">100% Verified</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 lg:gap-4">
        {/* LOGO AREA */}
        <div
          id="header-brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#7A1C2E] to-[#3B0712] flex items-center justify-center shadow-md border border-amber-400/50 group-hover:scale-105 group-hover:border-amber-300 transition-all duration-200">
            <KolamMotif size={22} color="#F3E5AB" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-base sm:text-lg font-bold font-serif-brand tracking-wider text-amber-200 group-hover:text-amber-100 transition-colors">
                KONGU NILA
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase tracking-widest hidden sm:inline-block">
                Matrimony
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-amber-200/75 font-medium tracking-wide mt-0.5">
              {language === 'ta' ? 'மனதிற்குப் பிடித்த வாழ்க்கைத்துணை' : 'Find Someone Who Feels Like Home'}
            </p>
          </div>
        </div>

        {/* CENTER NAVIGATION LINKS (DESKTOP) */}
        <nav
          id="header-main-nav"
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-0.5 text-xs font-semibold text-stone-200"
        >
          {navLinks.map(link => {
            const active = isLinkActive(link.id);
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`px-2.5 py-1.5 rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'text-amber-200 bg-amber-950/70 border border-amber-400/50 font-bold shadow-xs shadow-amber-950/50'
                    : 'text-stone-300 hover:text-amber-200 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Tamil Language Selector */}
          <button
            id="btn-header-language-toggle"
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-xs font-bold text-amber-200 transition shadow-xs"
            title="Switch Language (English / தமிழ்)"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-tamil">{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="btn-header-theme-toggle"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200 flex items-center justify-center transition"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Authenticated Action Icons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Shortlist Icon */}
              <button
                id="btn-header-shortlists"
                onClick={() => handleNavClick('shortlists')}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                  currentTab === 'shortlists'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 border-amber-500/30 text-stone-300 hover:text-amber-200'
                }`}
                title="My Shortlisted Profiles"
                aria-label="My Shortlisted Profiles"
              >
                <Bookmark className="w-4 h-4" />
                {shortlists.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-stone-950 text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {shortlists.length}
                  </span>
                )}
              </button>

              {/* Interests Icon */}
              <button
                id="btn-header-interests"
                onClick={() => handleNavClick('interests')}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                  currentTab === 'interests'
                    ? 'bg-rose-950/80 border-rose-400 text-rose-300 shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 border-amber-500/30 text-stone-300 hover:text-rose-300'
                }`}
                title="Received Interests"
                aria-label="Received Interests"
              >
                <Heart className="w-4 h-4" />
                {pendingInterestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {pendingInterestsCount}
                  </span>
                )}
              </button>

              {/* Messages / WhatsApp Icon */}
              <button
                id="btn-header-messages"
                onClick={() => handleNavClick('messages')}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                  currentTab === 'messages'
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 border-amber-500/30 text-stone-300 hover:text-emerald-300'
                }`}
                title="Direct Messages"
                aria-label="Direct Messages"
              >
                <MessageCircle className="w-4 h-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-stone-950 text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Notifications Bell Icon */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  id="btn-header-notifications"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                    isNotificationOpen
                      ? 'bg-sky-950/80 border-sky-400 text-sky-300 shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 border-amber-500/30 text-stone-300 hover:text-sky-300'
                  }`}
                  title="Notifications"
                  aria-label="Notifications"
                  aria-expanded={isNotificationOpen}
                >
                  <Bell className="w-4 h-4" />
                  {notificationService.getUnreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-sky-500 text-stone-950 text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {notificationService.getUnreadCount()}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#160A0D] text-stone-200 rounded-2xl shadow-2xl border border-amber-500/40 p-3 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                      <span className="text-xs font-bold font-serif-brand text-amber-200">
                        Notifications ({notificationService.getUnreadCount()} unread)
                      </span>
                      {notificationService.getUnreadCount() > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            notificationService.markAllAsRead();
                            setIsNotificationOpen(false);
                          }}
                          className="text-[10px] text-amber-400 hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-stone-800/60 max-h-64 overflow-y-auto">
                      {notificationService.getNotifications().slice(0, 4).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            notificationService.markAsRead(n.id);
                            setIsNotificationOpen(false);
                            if (n.linkTo === 'interests') handleNavClick('interests');
                            else if (n.linkTo === 'messages') handleNavClick('messages');
                            else if (n.linkTo === 'membership') handleNavClick('membership');
                            else if (n.linkTo === 'my-profile') handleNavClick('my-profile');
                            else handleNavClick('dashboard');
                          }}
                          className={`p-2 rounded-xl transition cursor-pointer my-1 text-xs ${
                            !n.read ? 'bg-amber-950/40 border border-amber-500/30' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-100 truncate">{n.title}</span>
                            <span className="text-[9px] text-stone-400">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-stone-300 line-clamp-2 mt-0.5">{n.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 text-center border-t border-amber-500/20">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotificationOpen(false);
                          handleNavClick('dashboard');
                        }}
                        className="text-[11px] text-amber-300 hover:underline font-bold block w-full py-1"
                      >
                        View Notification Center →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar & Dropdown Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  id="btn-header-profile-menu"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 h-9 pl-1 pr-2 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/40 hover:border-amber-400 transition shadow-xs"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={
                      currentUser.photos[0] ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400"
                  />
                  <span className="text-xs font-bold text-amber-200 hidden md:inline truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-300 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#160A0D] text-stone-200 rounded-2xl shadow-2xl border border-amber-500/40 p-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                    {/* User Identity Header */}
                    <div className="p-3 border-b border-amber-500/20 bg-black/20 rounded-xl mb-1">
                      <p className="text-[11px] font-mono font-bold text-amber-400">{currentUser.profileId}</p>
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-300 font-semibold">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span className="uppercase">{currentUser.membershipTier} Member</span>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-1 space-y-0.5 text-xs font-semibold">
                      <button
                        id="menu-item-dashboard"
                        onClick={() => {
                          handleNavClick('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-stone-300 hover:text-amber-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        id="menu-item-my-profile"
                        onClick={() => {
                          handleNavClick('my-profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-stone-300 hover:text-amber-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Edit Profile & Photos</span>
                      </button>

                      <button
                        id="menu-item-safety"
                        onClick={() => {
                          handleNavClick('safety');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-stone-300 hover:text-amber-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                        <span>Safety & Privacy</span>
                      </button>

                      <button
                        id="menu-item-admin"
                        onClick={() => {
                          handleNavClick('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-amber-300 hover:text-amber-100 hover:bg-amber-950/60 rounded-xl flex items-center gap-2 transition border border-amber-500/20"
                      >
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>Admin Portal</span>
                      </button>
                    </div>

                    {/* Sign Out Action */}
                    <div className="pt-1 mt-1 border-t border-amber-500/20">
                      <button
                        id="menu-item-logout"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          setCurrentTab('home');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Unauthenticated Login & Register CTA Buttons */
            <div className="flex items-center gap-2">
              <button
                id="btn-header-login"
                onClick={openLoginModal}
                className="h-9 px-3 sm:px-4 text-xs font-bold text-amber-200 hover:text-white bg-white/5 hover:bg-white/10 border border-amber-500/30 rounded-xl transition"
              >
                Login
              </button>
              <button
                id="btn-header-register"
                onClick={openRegistrationModal}
                className="h-9 px-3.5 sm:px-5 text-xs font-bold text-white bg-gradient-to-r from-[#7A1C2E] to-[#991B33] hover:from-[#8B1E34] hover:to-[#B3203E] border border-amber-400/40 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Create Profile
              </button>
            </div>
          )}

          {/* Mobile Navigation Drawer Toggle */}
          <button
            id="btn-header-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200 flex items-center justify-center transition"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE RESPONSIVE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden bg-[#14080B] text-stone-200 border-b border-amber-500/30 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200 shadow-2xl"
        >
          {/* Main Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => {
              const active = isLinkActive(link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`p-2.5 text-left rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                    active
                      ? 'bg-amber-950/80 text-amber-300 border-amber-400/60 shadow-xs'
                      : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* Extra Shortcuts */}
          <div className="pt-2 border-t border-amber-500/20 flex flex-wrap gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNavClick('horoscope')}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-amber-200 text-xs font-semibold cursor-pointer"
            >
              10-Porutham
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-amber-200 text-xs font-semibold cursor-pointer"
            >
              Wedding Guides
            </button>
            <button
              onClick={() => handleNavClick('safety')}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-amber-200 text-xs font-semibold cursor-pointer"
            >
              Safety & Privacy
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer"
            >
              Admin Portal
            </button>
          </div>

          {/* Action Row for Unauthenticated Visitors */}
          {!isAuthenticated && (
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  openLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-1/2 py-2.5 text-center text-xs font-bold bg-white/5 border border-amber-500/30 text-amber-200 rounded-xl"
              >
                Login
              </button>
              <button
                onClick={() => {
                  openRegistrationModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-1/2 py-2.5 text-center text-xs font-bold bg-gradient-to-r from-[#7A1C2E] to-[#991B33] text-white rounded-xl shadow-md border border-amber-400/40"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
