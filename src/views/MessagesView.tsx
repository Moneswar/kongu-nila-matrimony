import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useMatrimony } from '../context/MatrimonyContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ICEBREAKER_TEMPLATES } from '../services/chatService';
import { KolamMotif } from '../components/common/KolamMotif';
import { Profile, Conversation, ChatMessage } from '../types';
import {
  MessageCircle,
  Send,
  ShieldCheck,
  Check,
  CheckCheck,
  Sparkles,
  Search,
  MoreVertical,
  AlertTriangle,
  Ban,
  Trash2,
  ArrowLeft,
  Lock,
  X,
  ChevronRight,
  Heart,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MessagesViewProps {
  setCurrentTab?: (tab: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ setCurrentTab }) => {
  const {
    conversations,
    profiles,
    interests,
    selectedProfileForChat,
    openProfileDetail,
    sendMessage,
    markConversationAsRead,
    clearConversation,
    blockProfile,
    unblockProfile,
    reportProfile,
    blockedProfileIds,
    sendInterest
  } = useMatrimony();

  const { t } = useLanguage();

  // Active Partner Selection
  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    if (selectedProfileForChat) return selectedProfileForChat.id;
    return conversations[0]?.partnerProfile?.id || '';
  });

  // Mobile View state: 'list' | 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  // Input & validation
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  // More Menu dropdown state
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>('Fake Profile');
  const [reportDetails, setReportDetails] = useState<string>('');

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Update active partner when selectedProfileForChat changes externally
  useEffect(() => {
    if (selectedProfileForChat) {
      setActivePartnerId(selectedProfileForChat.id);
      setMobileView('chat');
    }
  }, [selectedProfileForChat]);

  // Click outside More Menu listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered conversation list
  const filteredConversations = useMemo(() => {
    let list = [...conversations];

    // Search query by name, profile ID, or location
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        c =>
          c.partnerProfile.name.toLowerCase().includes(q) ||
          c.partnerProfile.profileId.toLowerCase().includes(q) ||
          (c.partnerProfile.city && c.partnerProfile.city.toLowerCase().includes(q)) ||
          (c.partnerProfile.district && c.partnerProfile.district.toLowerCase().includes(q))
      );
    }

    // Filter by unread
    if (filterType === 'unread') {
      list = list.filter(c => c.unreadCount > 0);
    }

    return list;
  }, [conversations, searchQuery, filterType]);

  // Current active conversation object
  const currentConvo = useMemo(() => {
    if (!activePartnerId) return conversations[0] || null;
    return (
      conversations.find(
        c => c.partnerProfile.id === activePartnerId || c.partnerProfile.profileId === activePartnerId
      ) || null
    );
  }, [conversations, activePartnerId]);

  // Fallback profile if conversation doesn't exist yet but profile was selected
  const activePartnerProfile: Profile | null = useMemo(() => {
    if (currentConvo) return currentConvo.partnerProfile;
    if (activePartnerId) {
      return (
        profiles.find(p => p.id === activePartnerId || p.profileId === activePartnerId) || null
      );
    }
    return conversations[0]?.partnerProfile || null;
  }, [currentConvo, activePartnerId, profiles, conversations]);

  // Check matrimonial connection status with active partner
  const connectionStatus = useMemo(() => {
    if (!activePartnerProfile) return 'none';
    const rec = interests.find(
      i =>
        (i.fromProfileId === 'current_user' &&
          (i.toProfileId === activePartnerProfile.id || i.profile?.profileId === activePartnerProfile.profileId)) ||
        (i.toProfileId === 'current_user' &&
          (i.fromProfileId === activePartnerProfile.id || i.profile?.profileId === activePartnerProfile.profileId)) ||
        (i.profile?.id === activePartnerProfile.id) ||
        (i.profile?.profileId === activePartnerProfile.profileId)
    );
    if (!rec) return 'none';
    return rec.status; // 'pending' | 'accepted' | 'declined' | 'withdrawn'
  }, [interests, activePartnerProfile]);

  const isConnected = connectionStatus === 'accepted';
  const isBlocked = Boolean(activePartnerProfile && blockedProfileIds.includes(activePartnerProfile.id));

  // Mark active conversation as read when opened
  useEffect(() => {
    if (activePartnerProfile) {
      markConversationAsRead(activePartnerProfile.id);
    }
  }, [activePartnerProfile?.id]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (currentConvo?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConvo?.messages?.length]);

  const handleSelectConversation = (partner: Profile) => {
    setActivePartnerId(partner.id);
    markConversationAsRead(partner.id);
    setMobileView('chat');
    setIsMoreMenuOpen(false);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || !activePartnerProfile || isBlocked || isSending) return;

    setIsSending(true);
    try {
      sendMessage(cleanText, activePartnerProfile);
      setInputText('');
      setShowIcebreakers(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplyIcebreaker = (tmpl: string) => {
    setInputText(tmpl);
    setShowIcebreakers(false);
  };

  const handleConfirmBlock = () => {
    if (activePartnerProfile) {
      blockProfile(activePartnerProfile.id);
      setIsBlockModalOpen(false);
      setIsMoreMenuOpen(false);
    }
  };

  const handleConfirmUnblock = () => {
    if (activePartnerProfile) {
      unblockProfile(activePartnerProfile.id);
      setIsMoreMenuOpen(false);
    }
  };

  const handleConfirmClear = () => {
    if (currentConvo) {
      clearConversation(currentConvo.id);
      setIsClearModalOpen(false);
      setIsMoreMenuOpen(false);
    }
  };

  const handleConfirmReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePartnerProfile) {
      reportProfile(activePartnerProfile.id, reportReason, reportDetails);
      setIsReportModalOpen(false);
      setIsMoreMenuOpen(false);
      setReportDetails('');
    }
  };

  const fallbackPhoto = (gender?: string) =>
    gender === 'female'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-5 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-xl space-y-3">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-kolam-pattern" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
            <KolamMotif size={16} color="#F3E5AB" />
            <span>Secured Matrimonial Communication</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-200/90 bg-black/40 px-3 py-1 rounded-full border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Privacy Protected</span>
          </div>
        </div>

        <div className="relative space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-brand text-amber-100 flex items-center gap-2.5">
            <MessageCircle className="w-6 h-6 text-amber-400" />
            <span>{t('msgConversations')}</span>
            <span className="text-sm sm:text-base font-normal font-sans text-amber-200">
              (நேரலை குடும்ப உரையாடல்கள்)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90">
            Engage in private, dignified communication between prospective families.
          </p>
        </div>
      </div>

      {/* 2. Main Dual-Panel Messaging Interface */}
      <div className="bg-white dark:bg-[#1A0F12] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden min-h-[620px] grid grid-cols-1 md:grid-cols-12">
        {/* ============================================================ */}
        {/* LEFT PANEL: Conversation List (Desktop & Mobile view 'list') */}
        {/* ============================================================ */}
        <div
          className={`md:col-span-5 lg:col-span-4 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Conversation List Header */}
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center gap-2">
                <span>{t('msgConversations')}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-sans">
                  {conversations.length}
                </span>
              </h2>

              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                Connected Members
              </span>
            </div>

            {/* Search in conversations */}
            <div className="relative">
              <label htmlFor="search-conversations-input" className="sr-only">
                Search conversations
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="search-conversations-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('msgSearchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg transition border cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                {t('all')}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('unread')}
                className={`px-3 py-1 rounded-lg transition border cursor-pointer flex items-center gap-1 ${
                  filterType === 'unread'
                    ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span>Unread</span>
              </button>
            </div>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60 max-h-[560px]">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(c => {
                const isActive = activePartnerProfile?.id === c.partnerProfile.id;
                const isItemBlocked = blockedProfileIds.includes(c.partnerProfile.id);
                const photo = c.partnerProfile.photos?.[0] || fallbackPhoto(c.partnerProfile.gender);

                return (
                  <div
                    key={c.id}
                    id={`conversation-item-${c.id}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectConversation(c.partnerProfile);
                      }
                    }}
                    onClick={() => handleSelectConversation(c.partnerProfile)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition focus:outline-none focus:bg-amber-50 dark:focus:bg-stone-800 ${
                      isActive
                        ? 'bg-amber-50/80 dark:bg-stone-800/80 border-l-4 border-[#7A1C2E] dark:border-amber-400'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={photo}
                        alt={c.partnerProfile.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-amber-400/40 shadow-2xs"
                      />
                      {/* Presence: Only show online if isOnline is strictly true */}
                      {c.partnerProfile.isOnline && (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900"
                          title="Online"
                        />
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs sm:text-sm truncate font-serif-brand ${
                            c.unreadCount > 0
                              ? 'font-bold text-stone-900 dark:text-white'
                              : 'font-semibold text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {c.partnerProfile.name}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono shrink-0">
                          {c.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-amber-900 dark:text-amber-400 font-medium truncate">
                        {c.partnerProfile.profession} • {c.partnerProfile.city}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p
                          className={`text-xs truncate ${
                            c.unreadCount > 0
                              ? 'font-bold text-stone-900 dark:text-stone-100'
                              : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isItemBlocked ? (
                            <span className="text-stone-400 italic">Conversation unavailable</span>
                          ) : (
                            c.lastMessage || t('msgStartConversation')
                          )}
                        </p>

                        {c.unreadCount > 0 && (
                          <span
                            className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                            title={`${c.unreadCount} unread messages`}
                          >
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty Conversation List */
              <div className="p-8 text-center space-y-3 my-auto">
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-stone-800 flex items-center justify-center mx-auto text-[#7A1C2E] dark:text-amber-400">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                    {searchQuery ? 'No matching conversations' : t('msgNoConversations')}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                    {searchQuery
                      ? 'Try clearing the search query to view all conversations.'
                      : t('msgNoConversationsDesc')}
                  </p>
                </div>
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentTab && setCurrentTab('search')}
                    className="px-4 py-2 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer"
                  >
                    {t('msgExploreMatches')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Left Footer: Safety Guidelines Reminder */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matrimonial Trust Verified</span>
            </span>
            <button
              type="button"
              onClick={() => setCurrentTab && setCurrentTab('safety')}
              className="text-[#7A1C2E] dark:text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Safety Rules
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL: Active Conversation (Desktop & Mobile 'chat') */}
        {/* ============================================================ */}
        <div
          className={`md:col-span-7 lg:col-span-8 flex flex-col justify-between bg-stone-50/40 dark:bg-stone-950/40 min-h-[600px] ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePartnerProfile ? (
            <>
              {/* 1. Chat Header */}
              <div className="p-3.5 sm:p-4 bg-white dark:bg-[#1A0F12] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-2xs shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileView('list')}
                    className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 cursor-pointer"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Partner Photo */}
                  <div
                    onClick={() => openProfileDetail(activePartnerProfile)}
                    className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shrink-0 border border-amber-400/40 shadow-xs cursor-pointer group"
                    title="View Profile Details"
                  >
                    <img
                      src={activePartnerProfile.photos?.[0] || fallbackPhoto(activePartnerProfile.gender)}
                      alt={activePartnerProfile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {activePartnerProfile.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900" />
                    )}
                  </div>

                  {/* Partner Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        onClick={() => openProfileDetail(activePartnerProfile)}
                        className="font-bold text-sm sm:text-base text-stone-900 dark:text-amber-100 hover:text-[#7A1C2E] dark:hover:text-amber-300 transition cursor-pointer font-serif-brand truncate"
                      >
                        {activePartnerProfile.name}
                      </h3>
                      <span className="text-xs text-stone-500 font-medium">
                        ({activePartnerProfile.age} Yrs)
                      </span>
                      {activePartnerProfile.isVerified && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {activePartnerProfile.profession} • {activePartnerProfile.city}, {activePartnerProfile.district} • {activePartnerProfile.kootamGothram || activePartnerProfile.subCaste}
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openProfileDetail(activePartnerProfile)}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition cursor-pointer border border-stone-200 dark:border-stone-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('viewProfile')}</span>
                  </button>

                  {/* More Menu */}
                  <div className="relative" ref={moreMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
                      aria-label="More conversation options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMoreMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 z-30 text-xs animate-in fade-in duration-100">
                        <button
                          type="button"
                          onClick={() => {
                            openProfileDetail(activePartnerProfile);
                            setIsMoreMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>{t('viewProfile')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsClearModalOpen(true);
                            setIsMoreMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-stone-500" />
                          <span>{t('msgClearChat')}</span>
                        </button>

                        <div className="my-1 border-t border-stone-100 dark:border-stone-800" />

                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={handleConfirmUnblock}
                            className="w-full px-4 py-2 text-left text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 font-semibold cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('msgUnblock')}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsBlockModalOpen(true);
                              setIsMoreMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-semibold cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{t('msgBlock')}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsReportModalOpen(true);
                            setIsMoreMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{t('msgReport')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Safety Reminder Header */}
              <div className="px-4 py-2 bg-amber-50/70 dark:bg-stone-900/60 border-b border-amber-200/60 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {t('msgSafetyNotice')}
                </span>
              </div>

              {/* 3. Messages Body / Blocked State / Connection Permission Check */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs bg-stone-50/30 dark:bg-stone-950/30 max-h-[460px]"
              >
                {isBlocked ? (
                  /* Blocked Banner */
                  <div className="p-8 text-center space-y-3 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 max-w-md mx-auto my-auto shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
                      <Ban className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                        {t('msgConversationUnavailable')}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                        You have blocked this profile. You will not receive or send messages.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmUnblock}
                      className="px-4 py-2 border border-emerald-500 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer"
                    >
                      {t('msgUnblock')}
                    </button>
                  </div>
                ) : !isConnected ? (
                  /* Not Connected State Explanation */
                  <div className="p-8 text-center space-y-4 bg-white dark:bg-stone-900 rounded-3xl border border-amber-300 dark:border-stone-800 max-w-md mx-auto my-auto shadow-xs">
                    <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-[#7A1C2E] dark:text-amber-400">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                        {t('msgConnectedOnly')}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        In accordance with Kongu Nila Matrimonial decorum, direct family messaging is unlocked when both families accept an expression of interest.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => sendInterest(activePartnerProfile)}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-amber-300" />
                        <span>Send Interest (விருப்பம்)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openProfileDetail(activePartnerProfile)}
                        className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
                      >
                        {t('viewProfile')}
                      </button>
                    </div>
                  </div>
                ) : currentConvo && currentConvo.messages.length > 0 ? (
                  /* Active Message Stream */
                  <>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center my-2">
                      <span className="px-3 py-1 bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full text-[10px] font-bold font-mono">
                        Auspicious Family Discussion
                      </span>
                    </div>

                    {currentConvo.messages.map(msg => {
                      const isMe = msg.senderId === 'current_user';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                              isMe
                                ? 'bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-tr-xs'
                                : 'bg-white dark:bg-[#1E1417] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-tl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-stone-400 font-mono">
                            <span>{msg.timestamp}</span>
                            {isMe && (
                              <span>
                                {msg.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-500 inline" title="Read" />
                                ) : msg.status === 'delivered' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-stone-400 inline" title="Delivered" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-stone-400 inline" title="Sent" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  /* Empty Messages State in Connected conversation */
                  <div className="p-8 text-center space-y-4 my-auto">
                    <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-stone-800 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400">
                      <KolamMotif size={28} color="#D4AF37" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                        {t('msgStartConversation')}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                        {t('msgStartConversationDesc')}
                      </p>
                    </div>

                    {/* Pre-set Icebreaker Suggestions */}
                    <div className="pt-2 max-w-md mx-auto space-y-2 text-left">
                      <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Suggested Auspicious Starters:
                      </span>
                      <div className="space-y-1.5">
                        {ICEBREAKER_TEMPLATES.slice(0, 3).map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyIcebreaker(tmpl)}
                            className="w-full p-2.5 bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-800/80 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-700 dark:text-stone-300 transition text-left cursor-pointer flex items-center justify-between group"
                          >
                            <span className="line-clamp-2">{tmpl}</span>
                            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Message Input Bar */}
              {isConnected && !isBlocked && (
                <div className="p-3.5 sm:p-4 bg-white dark:bg-[#1A0F12] border-t border-stone-200 dark:border-stone-800 shrink-0 space-y-2">
                  {/* Suggested Starters Toggle */}
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setShowIcebreakers(!showIcebreakers)}
                      className="text-[11px] font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{showIcebreakers ? 'Hide Starters' : 'Use Starter Templates'}</span>
                    </button>
                    <span className="text-[10px] text-stone-400">
                      Press <kbd className="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[9px] font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[9px] font-mono">Shift+Enter</kbd> for new line
                    </span>
                  </div>

                  {/* Starters Carousel */}
                  {showIcebreakers && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none animate-in fade-in duration-150">
                      {ICEBREAKER_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyIcebreaker(tmpl)}
                          className="shrink-0 p-2 bg-[#FAF7F2] dark:bg-stone-800/80 hover:bg-amber-100 dark:hover:bg-stone-700 border border-amber-300/60 dark:border-stone-700 rounded-xl text-[11px] text-stone-700 dark:text-stone-200 max-w-[260px] text-left transition cursor-pointer"
                        >
                          <span className="line-clamp-2">{tmpl}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input Form */}
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <label htmlFor="message-textarea" className="sr-only">
                        Write a message
                      </label>
                      <textarea
                        id="message-textarea"
                        value={inputText}
                        onChange={e => setInputText(e.target.value.slice(0, 1000))}
                        onKeyDown={handleKeyDown}
                        rows={2}
                        placeholder={t('msgTypePlaceholder')}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                      />
                      {inputText.length > 800 && (
                        <span className="absolute right-3 bottom-2 text-[10px] text-stone-400 font-mono">
                          {inputText.length} / 1000
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!inputText.trim() || isSending}
                      className="px-5 py-3 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] disabled:opacity-40 text-white rounded-2xl font-bold shadow-md transition flex items-center justify-center cursor-pointer shrink-0"
                      aria-label="Send message"
                      title={t('msgSend')}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            /* Empty Active Chat Pane */
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-stone-800 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                Select a conversation to begin messaging
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                Choose a prospective connection from the left panel to review message history and discuss family alliances.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. Block Profile Confirmation Modal */}
      {/* ============================================================ */}
      {isBlockModalOpen && activePartnerProfile && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsBlockModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-stone-100">
                Block {activePartnerProfile.name}?
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                You will no longer receive messages from this profile. You can unblock them anytime from the options menu.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBlockModalOpen(false)}
                className="flex-1 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {t('msgBlock')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. Report Profile Modal */}
      {/* ============================================================ */}
      {isReportModalOpen && activePartnerProfile && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 max-w-md w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-stone-100">
                  {t('msgReport')}
                </h4>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                aria-label="Close report dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400">
              Help maintain a trusted matrimony platform by reporting fake, inappropriate, or suspicious profiles.
            </p>

            <form onSubmit={handleConfirmReport} className="space-y-3.5">
              <div>
                <label htmlFor="report-reason-select" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Reason for Reporting:
                </label>
                <select
                  id="report-reason-select"
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Fake Profile">Fake Profile / Identity Misrepresentation</option>
                  <option value="Harassment">Harassment or Inappropriate Messages</option>
                  <option value="Inappropriate Content">Inappropriate Photos or Biodata</option>
                  <option value="Suspicious Activity">Suspicious Financial or Commercial Requests</option>
                  <option value="Other">Other Violation of Terms</option>
                </select>
              </div>

              <div>
                <label htmlFor="report-details-input" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Additional Details (Optional):
                </label>
                <textarea
                  id="report-details-input"
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide any specific context for our safety moderators..."
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. Clear Conversation Confirmation Modal */}
      {/* ============================================================ */}
      {isClearModalOpen && currentConvo && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsClearModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-stone-100">
                Clear this conversation?
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                This will delete message history for this conversation on your account.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="flex-1 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 bg-[#7A1C2E] hover:bg-[#8B1E34] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {t('msgClearChat')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
