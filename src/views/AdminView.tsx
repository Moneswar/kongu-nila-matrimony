import React, { useState } from 'react';
import { useMatrimony } from '../context/MatrimonyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminService, VerificationRequest, AdminStats, AdminReport, AuditLogEntry } from '../services/adminService';
import { membershipService } from '../services/membershipService';
import { profileService } from '../services/profileService';
import { mockPlans } from '../data/mockPlans';
import { KolamMotif } from '../components/common/KolamMotif';
import { Profile } from '../types';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Search,
  Eye,
  Crown,
  Receipt,
  Bell,
  SlidersHorizontal,
  FileText,
  Lock,
  ArrowRight,
  RefreshCw,
  Ban,
  Check,
  X,
  AlertCircle,
  Clock,
  Send,
  HelpCircle,
  BookOpen,
  Info
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { profiles, openProfileDetail } = useMatrimony();
  const { isAdmin, toggleRole } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'verification' | 'reports' | 'memberships' | 'transactions' | 'notifications' | 'content' | 'settings'
  >('overview');

  // Operational State
  const [stats, setStats] = useState<AdminStats>(() => adminService.getStats());
  const [verifications, setVerifications] = useState<VerificationRequest[]>(() =>
    adminService.getVerificationRequests()
  );
  const [reports, setReports] = useState<AdminReport[]>(() => adminService.getReports());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => adminService.getAuditLogs());
  const [transactions] = useState(() => membershipService.getTransactions());

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'verified' | 'pending' | 'premium' | 'free'>('all');
  const [suspendedProfileIds, setSuspendedProfileIds] = useState<string[]>([]);

  // Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    danger?: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  // Broadcast Notification Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const handleApproveVerification = (req: VerificationRequest) => {
    const updated = adminService.updateVerificationStatus(req.id, 'approved');
    setVerifications(updated);
    adminService.logAuditAction('SuperAdmin', `Approved ${req.documentType}`, `${req.profileName} (${req.profileId})`, 'Success');
    setAuditLogs(adminService.getAuditLogs());
    showToast(`Verification for ${req.profileName} approved.`, 'success');
  };

  const handleRejectVerification = (req: VerificationRequest) => {
    setConfirmAction({
      isOpen: true,
      title: `Reject Verification for ${req.profileName}?`,
      description: `This will decline the submitted ${req.documentType}. The user will be notified to upload valid documents.`,
      danger: true,
      onConfirm: () => {
        const updated = adminService.updateVerificationStatus(req.id, 'rejected');
        setVerifications(updated);
        adminService.logAuditAction('SuperAdmin', `Rejected ${req.documentType}`, `${req.profileName} (${req.profileId})`, 'Warning');
        setAuditLogs(adminService.getAuditLogs());
        showToast(`Verification rejected for ${req.profileName}.`, 'info');
        setConfirmAction(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleResolveReport = (report: AdminReport) => {
    const updated = adminService.updateReportStatus(report.id, 'resolved', 'Audit completed by Admin');
    setReports(updated);
    adminService.logAuditAction('SuperAdmin', `Resolved Safety Report ${report.id}`, `Target: ${report.reportedName}`, 'Success');
    setAuditLogs(adminService.getAuditLogs());
    showToast(`Report ${report.id} marked as resolved.`, 'success');
  };

  const handleDismissReport = (report: AdminReport) => {
    const updated = adminService.updateReportStatus(report.id, 'dismissed', 'Dismissed as false report');
    setReports(updated);
    adminService.logAuditAction('SuperAdmin', `Dismissed Report ${report.id}`, `Target: ${report.reportedName}`, 'Success');
    setAuditLogs(adminService.getAuditLogs());
    showToast(`Report ${report.id} dismissed.`, 'info');
  };

  const handleToggleSuspendUser = (profile: Profile) => {
    const isSuspended = suspendedProfileIds.includes(profile.id);
    if (!isSuspended) {
      setConfirmAction({
        isOpen: true,
        title: `Suspend Profile ${profile.name}?`,
        description: `Suspending will hide ${profile.name} (${profile.profileId}) from public search results and disable communication.`,
        danger: true,
        onConfirm: () => {
          setSuspendedProfileIds(prev => [...prev, profile.id]);
          adminService.logAuditAction('SuperAdmin', 'Suspended Profile', `${profile.name} (${profile.profileId})`, 'Warning');
          setAuditLogs(adminService.getAuditLogs());
          showToast(`Profile ${profile.name} suspended.`, 'info');
          setConfirmAction(prev => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      setSuspendedProfileIds(prev => prev.filter(id => id !== profile.id));
      adminService.logAuditAction('SuperAdmin', 'Reactivated Profile', `${profile.name} (${profile.profileId})`, 'Success');
      setAuditLogs(adminService.getAuditLogs());
      showToast(`Profile ${profile.name} reactivated.`, 'success');
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('Please enter both title and message.', 'error');
      return;
    }
    adminService.broadcastAnnouncement(broadcastTitle, broadcastMessage);
    showToast(`Broadcast announcement "${broadcastTitle}" sent to all members.`, 'success');
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  // Filtered Users List
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch =
      userSearch.trim() === '' ||
      p.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.profileId.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.district.toLowerCase().includes(userSearch.toLowerCase()) ||
      (p.subCaste && p.subCaste.toLowerCase().includes(userSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (userStatusFilter === 'verified') return p.isVerified;
    if (userStatusFilter === 'pending') return !p.isVerified;
    if (userStatusFilter === 'premium') return p.membershipTier !== 'free';
    if (userStatusFilter === 'free') return p.membershipTier === 'free';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Operations & Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-brand text-amber-100">
            Kongu Nila Matrimony Administration
          </h1>
          <p className="text-xs text-amber-200/90 leading-relaxed max-w-2xl">
            Centralized platform oversight for profile identity audits, membership subscriptions, safety reports, and community integrity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleRole}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Role: {isAdmin ? 'Administrator (Active)' : 'Standard User'}</span>
          </button>

          <span className="px-3 py-1 bg-amber-400 text-stone-950 font-bold text-xs rounded-full shadow-xs">
            Super Admin
          </span>
        </div>
      </div>

      {/* 2. SECURITY & BACKEND READINESS NOTICE */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Enterprise Security & Architecture Notice:</span>
          <p className="leading-relaxed">
            In production deployments, all administrative endpoints and queries are strictly protected by server-side JWT authentication, rate limiting, and role-based database security rules. Sensitive user passwords and payment secrets are never exposed to the frontend.
          </p>
        </div>
      </div>

      {/* 3. DUAL-PANEL ADMIN LAYOUT (SIDEBAR + MAIN VIEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1A0F12] rounded-3xl p-4 border border-stone-200 dark:border-amber-500/20 shadow-sm space-y-1 h-fit">
          {[
            { id: 'overview', label: 'Overview Dashboard', icon: TrendingUp, count: null },
            { id: 'users', label: 'Users & Profiles', icon: Users, count: profiles.length },
            { id: 'verification', label: 'KYC & ID Queue', icon: FileCheck, count: verifications.filter(v => v.status === 'pending').length },
            { id: 'reports', label: 'Safety & Reports', icon: AlertTriangle, count: reports.filter(r => r.status === 'pending').length },
            { id: 'memberships', label: 'Plans & Subscriptions', icon: Crown, count: null },
            { id: 'transactions', label: 'Transactions & Billing', icon: Receipt, count: transactions.length },
            { id: 'notifications', label: 'Broadcast Alerts', icon: Bell, count: null },
            { id: 'content', label: 'Content Management', icon: BookOpen, count: null },
            { id: 'settings', label: 'Audit Trail & Settings', icon: SlidersHorizontal, count: auditLogs.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#7A1C2E] text-white shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== null && tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="bg-white dark:bg-[#1A0F12] p-5 rounded-2xl border border-stone-200 dark:border-amber-500/20 shadow-xs space-y-1">
                  <span className="text-stone-500 dark:text-stone-400 font-bold">Total Platform Users</span>
                  <strong className="text-2xl font-bold text-stone-900 dark:text-amber-100 block">
                    {stats.totalUsers.toLocaleString()}
                  </strong>
                  <span className="text-[11px] text-emerald-600 font-bold">Live database active</span>
                </div>

                <div className="bg-white dark:bg-[#1A0F12] p-5 rounded-2xl border border-stone-200 dark:border-amber-500/20 shadow-xs space-y-1">
                  <span className="text-stone-500 dark:text-stone-400 font-bold">Verified Profiles</span>
                  <strong className="text-2xl font-bold text-emerald-600 block">
                    {stats.verifiedProfiles.toLocaleString()}
                  </strong>
                  <span className="text-[11px] text-stone-400">92% screened</span>
                </div>

                <div className="bg-white dark:bg-[#1A0F12] p-5 rounded-2xl border border-stone-200 dark:border-amber-500/20 shadow-xs space-y-1">
                  <span className="text-stone-500 dark:text-stone-400 font-bold">Pending KYC Queue</span>
                  <strong className="text-2xl font-bold text-amber-600 dark:text-amber-400 block">
                    {verifications.filter(v => v.status === 'pending').length}
                  </strong>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold">Awaiting review</span>
                </div>

                <div className="bg-white dark:bg-[#1A0F12] p-5 rounded-2xl border border-stone-200 dark:border-amber-500/20 shadow-xs space-y-1">
                  <span className="text-stone-500 dark:text-stone-400 font-bold">Open Safety Reports</span>
                  <strong className="text-2xl font-bold text-rose-600 block">
                    {reports.filter(r => r.status === 'pending').length}
                  </strong>
                  <span className="text-[11px] text-rose-600 font-bold">Under review</span>
                </div>

                <div className="bg-white dark:bg-[#1A0F12] p-5 rounded-2xl border border-stone-200 dark:border-amber-500/20 shadow-xs space-y-1">
                  <span className="text-stone-500 dark:text-stone-400 font-bold">Active Subscriptions</span>
                  <strong className="text-2xl font-bold text-[#7A1C2E] dark:text-amber-300 block">
                    {stats.premiumSubscribers.toLocaleString()}
                  </strong>
                  <span className="text-[11px] text-amber-700 font-bold">Classic & Diamond</span>
                </div>

                <div className="bg-white dark:bg-[#1A0F12] p-5 rounded-2xl border border-stone-200 dark:border-amber-500/20 shadow-xs space-y-1">
                  <span className="text-stone-500 dark:text-stone-400 font-bold">Estimated Platform Revenue</span>
                  <strong className="text-2xl font-bold text-emerald-600 block">
                    ₹ {stats.totalRevenueInr.toLocaleString()}
                  </strong>
                  <span className="text-[11px] text-stone-400 font-mono">Simulated Billing</span>
                </div>
              </div>

              {/* Recent Audit Feed */}
              <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="text-base font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Recent Administrative Operations Log</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:underline"
                  >
                    View All Logs
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
                  {auditLogs.slice(0, 4).map(log => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-stone-900 dark:text-stone-100">{log.action}</span>
                        <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                          Target: <strong>{log.target}</strong> • by {log.adminUser}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS & PROFILES MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                    User & Profile Database ({filteredProfiles.length})
                  </h3>
                  <p className="text-xs text-stone-500">Manage member accounts, verification tags, and operational states.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      placeholder="Search name, ID, district..."
                      className="pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-800 rounded-xl text-xs border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <select
                    value={userStatusFilter}
                    onChange={e => setUserStatusFilter(e.target.value as any)}
                    className="p-1.5 bg-stone-50 dark:bg-stone-800 rounded-xl text-xs border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified Only</option>
                    <option value="pending">Pending KYC</option>
                    <option value="premium">Premium Tiers</option>
                    <option value="free">Free Tier</option>
                  </select>
                </div>
              </div>

              {/* Profiles Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold">
                      <th className="py-2.5 px-3">Profile ID & Name</th>
                      <th className="py-2.5 px-3">Community / Kootam</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                    {filteredProfiles.map(p => {
                      const isSuspended = suspendedProfileIds.includes(p.id);
                      return (
                        <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.photos[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover border border-amber-400/30 shrink-0"
                              />
                              <div>
                                <strong className="text-stone-900 dark:text-stone-100 block">{p.name}</strong>
                                <span className="text-[10px] font-mono text-stone-500">{p.profileId}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                            {p.subCaste || p.community || 'Kongu Vellalar'}
                          </td>
                          <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                            {p.city}, {p.district}
                          </td>
                          <td className="py-3 px-3">
                            <span className="capitalize font-bold text-amber-800 dark:text-amber-400">
                              {p.membershipTier}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {isSuspended ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                                Suspended
                              </span>
                            ) : p.isVerified ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                Pending KYC
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => openProfileDetail(p)}
                              className="text-amber-800 dark:text-amber-400 hover:underline font-bold text-[11px] cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSuspendUser(p)}
                              className={`text-[11px] font-bold hover:underline cursor-pointer ${
                                isSuspended ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {isSuspended ? 'Reactivate' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KYC & VERIFICATION QUEUE */}
          {activeTab === 'verification' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Identity & KYC Verification Queue ({verifications.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Inspect submitted government IDs, Vedic horoscopes, and profile portraits.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold">
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Document Type</th>
                      <th className="py-2.5 px-3">Submitted</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                    {verifications.map(item => (
                      <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="py-3 px-3">
                          <strong className="block text-stone-900 dark:text-stone-100">{item.profileName}</strong>
                          <span className="text-[10px] font-mono text-stone-500">{item.profileId}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-stone-800 dark:text-stone-200">
                          {item.documentType}
                        </td>
                        <td className="py-3 px-3 text-stone-500">{item.submittedDate}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : item.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleApproveVerification(item)}
                            disabled={item.status === 'approved'}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectVerification(item)}
                            disabled={item.status === 'rejected'}
                            className="px-3 py-1 border border-stone-300 dark:border-stone-700 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 text-stone-700 dark:text-stone-300 font-bold rounded-lg text-xs transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY & REPORTS MODERATION */}
          {activeTab === 'reports' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Trust & Safety Moderation Queue ({reports.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Review reported violations, incorrect profile details, and unsolicited contact reports.
                </p>
              </div>

              <div className="space-y-3">
                {reports.map(rep => (
                  <div
                    key={rep.id}
                    className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-800 dark:text-amber-300 uppercase">
                          {rep.id}
                        </span>
                        <span className="text-stone-400">•</span>
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          Target: {rep.reportedName} ({rep.reportedProfileId})
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : rep.status === 'dismissed'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {rep.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-stone-700 dark:text-stone-300">
                      <strong>Reason:</strong> {rep.reason}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 leading-relaxed bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                      "{rep.description}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-[11px]">
                      <span className="text-stone-400 font-mono">Reported {rep.date}</span>

                      <div className="flex items-center gap-2">
                        {rep.status !== 'resolved' && (
                          <button
                            type="button"
                            onClick={() => handleResolveReport(rep)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                          >
                            Resolve & Warn
                          </button>
                        )}
                        {rep.status !== 'dismissed' && (
                          <button
                            type="button"
                            onClick={() => handleDismissReport(rep)}
                            className="px-3 py-1 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-lg transition cursor-pointer"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MEMBERSHIPS & PLANS */}
          {activeTab === 'memberships' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Matrimonial Membership Tiers & Benefits
                </h3>
                <p className="text-xs text-stone-500">Configure plan parameters, pricing, and contact view allowances.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPlans.map(plan => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold font-serif-brand text-base text-stone-900 dark:text-amber-100">
                        {plan.name}
                      </h4>
                      <span className="font-bold text-[#7A1C2E] dark:text-amber-300 text-sm">
                        ₹ {plan.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">Validity: {plan.durationMonths} Months • Contacts: {plan.contactViews}</p>
                    <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300 pt-1">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TRANSACTIONS & BILLING */}
          {activeTab === 'transactions' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Platform Billing & Invoices ({transactions.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Official financial ledger and subscriber transaction histories. Zero sensitive credentials stored.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold">
                      <th className="py-2.5 px-3">Transaction ID</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="py-3 px-3 font-mono font-bold text-stone-800 dark:text-stone-200">{t.id}</td>
                        <td className="py-3 px-3 font-semibold">{t.planName}</td>
                        <td className="py-3 px-3 font-bold text-[#7A1C2E] dark:text-amber-300">₹ {t.amount.toLocaleString()}</td>
                        <td className="py-3 px-3 text-stone-500">{t.date}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                            {t.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-stone-600 dark:text-stone-300">
                          {t.invoiceNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Broadcast Platform Announcements
                </h3>
                <p className="text-xs text-stone-500">
                  Send official notifications and platform alerts to all registered matrimonial members.
                </p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                    Announcement Title (அறிவிப்பு தலைப்பு)
                  </label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={e => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. Kongu Nila Matrimony Mega Meetup in Coimbatore"
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
                    Notification Message Details
                  </label>
                  <textarea
                    rows={3}
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                    placeholder="Enter announcement text for registered members..."
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Platform Broadcast</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: CONTENT MANAGEMENT */}
          {activeTab === 'content' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Platform Content & Cultural Guidelines
                </h3>
                <p className="text-xs text-stone-500">Manage Success Stories, FAQs, and Kongu Heritage references.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-amber-100">Success Stories (6)</h4>
                  <p className="text-stone-500">Verified couple testimonials with wedding photographs.</p>
                  <span className="text-emerald-600 font-bold block">✓ Published Live</span>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-amber-100">Matrimonial FAQs (12)</h4>
                  <p className="text-stone-500">Answers to horoscope, privacy, and payment questions.</p>
                  <span className="text-emerald-600 font-bold block">✓ Published Live</span>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-amber-100">Kongu Kootam Registry</h4>
                  <p className="text-stone-500">Exogamous lineage dictionary with 60+ certified kootams.</p>
                  <span className="text-emerald-600 font-bold block">✓ Verified Active</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AUDIT TRAIL & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Administrative Audit Trail & Security
                </h3>
                <p className="text-xs text-stone-500">Immutable ledger of all admin actions and moderator audits.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Admin Operator</th>
                      <th className="py-2.5 px-3">Operation</th>
                      <th className="py-2.5 px-3">Target Reference</th>
                      <th className="py-2.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="py-3 px-3 font-mono text-stone-500">{log.timestamp}</td>
                        <td className="py-3 px-3 font-bold text-stone-800 dark:text-stone-200">{log.adminUser}</td>
                        <td className="py-3 px-3 font-semibold">{log.action}</td>
                        <td className="py-3 px-3 text-stone-600 dark:text-stone-300">{log.target}</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setConfirmAction(prev => ({ ...prev, isOpen: false }))}
        >
          <div
            className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 max-w-md w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmAction.danger
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-stone-100">
                  {confirmAction.title}
                </h4>
                <p className="text-xs text-stone-500">Administrative Confirmation Required</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {confirmAction.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction.onConfirm}
                className={`px-5 py-2 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                  confirmAction.danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#7A1C2E] hover:bg-[#8B1E34]'
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
