import React, { useState, useEffect, useRef } from 'react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { ICEBREAKER_TEMPLATES } from '../../services/chatService';
import { KolamMotif } from '../common/KolamMotif';
import {
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Check,
  CheckCheck,
  AlertTriangle,
  Ban,
  Eye,
  Lock,
  Heart
} from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const {
    isChatDrawerOpen,
    closeChat,
    selectedProfileForChat: profile,
    conversations,
    interests,
    sendMessage,
    openProfileDetail,
    blockedProfileIds,
    blockProfile,
    unblockProfile,
    reportProfile,
    sendInterest
  } = useMatrimony();

  const [inputMessage, setInputMessage] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('Fake Profile');
  const [reportNotes, setReportNotes] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    c => profile && c.partnerProfile.id === profile.id
  );

  const isBlocked = Boolean(profile && blockedProfileIds.includes(profile.id));

  // Check connection status
  const connectionRecord = interests.find(
    i =>
      profile &&
      ((i.fromProfileId === 'current_user' && i.toProfileId === profile.id) ||
        (i.toProfileId === 'current_user' && i.fromProfileId === profile.id))
  );
  const isConnected = connectionRecord?.status === 'accepted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  if (!isChatDrawerOpen || !profile) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isBlocked || !isConnected) return;
    sendMessage(inputMessage.trim(), profile);
    setInputMessage('');
  };

  const handleSendIcebreaker = (text: string) => {
    if (isBlocked || !isConnected) return;
    sendMessage(text, profile);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportProfile(profile.id, reportReason, reportNotes);
    setShowReport(false);
    setReportNotes('');
  };

  return (
    <div
      id="chat-drawer-container"
      className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col justify-between animate-in slide-in-from-right duration-300"
    >
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white p-4 flex items-center justify-between shadow-md shrink-0 border-b border-amber-400/30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={profile.photos[0] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
              alt={profile.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-300 shadow-2xs"
            />
            {profile.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3
                onClick={() => openProfileDetail(profile)}
                className="font-bold text-sm text-amber-200 hover:underline cursor-pointer truncate font-serif-brand"
              >
                {profile.name}
              </h3>
              <span className="text-[10px] text-amber-300/80 font-mono shrink-0">({profile.profileId})</span>
            </div>
            <p className="text-[11px] text-amber-100/80 truncate">
              {profile.profession} • {profile.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => openProfileDetail(profile)}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={closeChat}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Safety Notice Bar */}
      <div className="bg-amber-50 dark:bg-stone-800/80 px-4 py-2 border-b border-amber-200 dark:border-stone-700 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Secured Matrimonial Chat</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[10px]">
          {isBlocked ? (
            <button
              onClick={() => unblockProfile(profile.id)}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
            >
              Unblock
            </button>
          ) : (
            <button
              onClick={() => blockProfile(profile.id)}
              className="text-stone-500 hover:text-rose-600 font-semibold"
            >
              Block
            </button>
          )}
          <span>•</span>
          <button
            onClick={() => setShowReport(!showReport)}
            className="text-rose-700 dark:text-rose-400 font-semibold hover:underline"
          >
            Report
          </button>
        </div>
      </div>

      {/* Report inline panel */}
      {showReport && (
        <form onSubmit={handleReportSubmit} className="p-3 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Report Profile to Trust Team
            </span>
            <button type="button" onClick={() => setShowReport(false)}>
              <X className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>
          <select
            value={reportReason}
            onChange={e => setReportReason(e.target.value)}
            className="w-full p-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
          >
            <option value="Fake Profile">Fake Profile / Impersonation</option>
            <option value="Harassment">Harassment or Inappropriate Behavior</option>
            <option value="Suspicious Activity">Suspicious Financial Requests</option>
            <option value="Other">Other Violation</option>
          </select>
          <input
            type="text"
            value={reportNotes}
            onChange={e => setReportNotes(e.target.value)}
            placeholder="Details (optional)..."
            className="w-full p-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReport(false)}
              className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs shadow-2xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50 dark:bg-stone-950/40 text-xs">
        {isBlocked ? (
          <div className="p-6 text-center space-y-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 my-auto shadow-2xs">
            <Ban className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="font-bold text-stone-800 dark:text-stone-200">Profile Blocked</p>
            <p className="text-stone-500 text-[11px]">
              You have blocked this profile and cannot exchange messages.
            </p>
            <button
              onClick={() => unblockProfile(profile.id)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-2xs mt-2"
            >
              Unblock Profile
            </button>
          </div>
        ) : !isConnected ? (
          <div className="p-6 text-center space-y-3 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-stone-800 my-auto shadow-2xs">
            <Lock className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="font-bold text-stone-800 dark:text-stone-200 font-serif-brand">
              Connect to Start Conversation
            </p>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Family messaging is enabled when both sides accept an expression of interest.
            </p>
            <button
              onClick={() => sendInterest(profile)}
              className="px-4 py-2 bg-[#7A1C2E] hover:bg-[#8B1E34] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 mx-auto transition"
            >
              <Heart className="w-3.5 h-3.5 text-amber-300" />
              <span>Send Interest (விருப்பம்)</span>
            </button>
          </div>
        ) : activeConversation?.messages && activeConversation.messages.length > 0 ? (
          activeConversation.messages.map(msg => {
            const isMe = msg.senderId === 'current_user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl shadow-2xs leading-relaxed ${
                    isMe
                      ? 'bg-[#7A1C2E] text-white rounded-tr-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <CheckCheck className="w-3 h-3 text-emerald-500" />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-amber-700">
              <KolamMotif size={24} color="#D4AF37" />
            </div>
            <p className="font-bold text-stone-800 dark:text-stone-200 font-serif-brand">
              Start an Auspicious Conversation
            </p>
            <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
              Choose an icebreaker or send a personal greeting from your family.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Pre-set Icebreakers */}
      {isConnected && !isBlocked && (
        <div className="p-2.5 bg-stone-100 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-700 shrink-0">
          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Suggested Auspicious Starters:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {ICEBREAKER_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendIcebreaker(tmpl)}
                className="shrink-0 px-2.5 py-1 bg-white dark:bg-stone-700 hover:bg-amber-50 dark:hover:bg-stone-600 border border-stone-200 dark:border-stone-600 rounded-lg text-[11px] text-stone-700 dark:text-stone-200 truncate max-w-[240px] text-left transition cursor-pointer"
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Field */}
      {isConnected && !isBlocked && (
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 bg-[#7A1C2E] hover:bg-[#8E2136] disabled:opacity-40 text-white rounded-xl shadow-xs transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
