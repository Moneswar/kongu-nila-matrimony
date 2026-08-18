import { Profile } from '../types';
import { profileService } from './profileService';
import { membershipService } from './membershipService';
import { notificationService } from './notificationService';

export interface AdminStats {
  totalUsers: number;
  verifiedProfiles: number;
  premiumSubscribers: number;
  pendingVerifications: number;
  openReports: number;
  activeConversations: number;
  totalRevenueInr: number;
}

export interface VerificationRequest {
  id: string;
  profileId: string;
  profileName: string;
  documentType: 'Aadhaar Card' | 'Driving License' | 'Passport' | 'Horoscope Chart' | 'Profile Selfie';
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl: string;
  notes?: string;
}

export interface AdminReport {
  id: string;
  reportedProfileId: string;
  reportedName: string;
  reporterId: string;
  reason: string;
  description: string;
  date: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  actionTaken?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  target: string;
  result: 'Success' | 'Warning' | 'Error';
}

const STORAGE_VERIFICATIONS_KEY = 'knm_admin_verifications';
const STORAGE_REPORTS_KEY = 'knm_admin_reports';
const STORAGE_AUDIT_KEY = 'knm_admin_audit_logs';

let memoryVerifications: VerificationRequest[] | null = null;
let memoryReports: AdminReport[] | null = null;
let memoryAuditLogs: AuditLogEntry[] | null = null;

const initialVerifications: VerificationRequest[] = [
  {
    id: 'vr1',
    profileId: 'KNM-2024-811',
    profileName: 'Sowmya Soundararajan',
    documentType: 'Aadhaar Card',
    submittedDate: 'Today, 09:30 AM',
    status: 'pending',
    documentUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=300&q=80',
    notes: 'Mobile OTP and Name match state registry records.'
  },
  {
    id: 'vr2',
    profileId: 'KNM-2024-419',
    profileName: 'Dr. Deepa Natarajan',
    documentType: 'Passport',
    submittedDate: 'Yesterday',
    status: 'approved',
    documentUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=300&q=80',
    notes: 'Government verification confirmed by staff.'
  },
  {
    id: 'vr3',
    profileId: 'KNM-2024-114',
    profileName: 'Vignesh Palanisamy',
    documentType: 'Horoscope Chart',
    submittedDate: '2 days ago',
    status: 'pending',
    documentUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    notes: 'Vedic chart birth time verification pending.'
  }
];

const initialReports: AdminReport[] = [
  {
    id: 'rep_101',
    reportedProfileId: 'KNM-2024-912',
    reportedName: 'Ramesh Kumar S',
    reporterId: 'KNM-2024-811',
    reason: 'Incorrect annual income details listed',
    description: 'Candidate stated working abroad but details do not match company profile.',
    date: 'Yesterday, 04:15 PM',
    status: 'pending'
  },
  {
    id: 'rep_102',
    reportedProfileId: 'KNM-2024-304',
    reportedName: 'Praveen K',
    reporterId: 'KNM-2024-550',
    reason: 'Unsolicited repetitive requests',
    description: 'Continuous messages after interest was declined.',
    date: '3 days ago',
    status: 'resolved',
    actionTaken: 'User issued formal safety reminder.'
  }
];

const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud_1',
    timestamp: 'Today, 10:15 AM',
    adminUser: 'SuperAdmin (Ops Team)',
    action: 'Approved Govt ID Verification',
    target: 'Dr. Deepa Natarajan (KNM-2024-419)',
    result: 'Success'
  },
  {
    id: 'aud_2',
    timestamp: 'Yesterday, 06:30 PM',
    adminUser: 'SuperAdmin (Ops Team)',
    action: 'Resolved Safety Report REP-102',
    target: 'Praveen K (KNM-2024-304)',
    result: 'Success'
  }
];

export const adminService = {
  getStats: (): AdminStats => {
    const profiles = profileService.getProfiles();
    const transactions = membershipService.getTransactions();
    const verifications = adminService.getVerificationRequests();
    const reports = adminService.getReports();

    const verifiedCount = profiles.filter(p => p.isVerified).length;
    const premiumCount = profiles.filter(p => p.membershipTier !== 'free').length;
    const pendingVerifCount = verifications.filter(v => v.status === 'pending').length;
    const openReportsCount = reports.filter(r => r.status === 'pending' || r.status === 'under_review').length;
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      totalUsers: profiles.length + 14200, // combined baseline + live workspace profiles
      verifiedProfiles: verifiedCount + 12100,
      premiumSubscribers: premiumCount + 3400,
      pendingVerifications: pendingVerifCount,
      openReports: openReportsCount,
      activeConversations: 184,
      totalRevenueInr: totalRevenue + 1485000
    };
  },

  getVerificationRequests: (): VerificationRequest[] => {
    if (memoryVerifications) return memoryVerifications;
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_VERIFICATIONS_KEY);
        if (stored) {
          memoryVerifications = JSON.parse(stored);
          return memoryVerifications!;
        }
      }
    } catch {
      // ignore
    }
    memoryVerifications = [...initialVerifications];
    return memoryVerifications;
  },

  updateVerificationStatus: (reqId: string, status: 'approved' | 'rejected'): VerificationRequest[] => {
    const list = adminService.getVerificationRequests().map(v =>
      v.id === reqId ? { ...v, status } : v
    );
    memoryVerifications = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_VERIFICATIONS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return list;
  },

  getReports: (): AdminReport[] => {
    if (memoryReports) return memoryReports;
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_REPORTS_KEY);
        if (stored) {
          memoryReports = JSON.parse(stored);
          return memoryReports!;
        }
      }
    } catch {
      // ignore
    }
    memoryReports = [...initialReports];
    return memoryReports;
  },

  updateReportStatus: (reportId: string, status: 'under_review' | 'resolved' | 'dismissed', actionTaken?: string): AdminReport[] => {
    const list = adminService.getReports().map(r =>
      r.id === reportId ? { ...r, status, actionTaken: actionTaken || r.actionTaken } : r
    );
    memoryReports = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return list;
  },

  getAuditLogs: (): AuditLogEntry[] => {
    if (memoryAuditLogs) return memoryAuditLogs;
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_AUDIT_KEY);
        if (stored) {
          memoryAuditLogs = JSON.parse(stored);
          return memoryAuditLogs!;
        }
      }
    } catch {
      // ignore
    }
    memoryAuditLogs = [...initialAuditLogs];
    return memoryAuditLogs;
  },

  logAuditAction: (adminUser: string, action: string, target: string, result: 'Success' | 'Warning' | 'Error' = 'Success'): AuditLogEntry => {
    const list = [...adminService.getAuditLogs()];
    const entry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      adminUser,
      action,
      target,
      result
    };
    list.unshift(entry);
    memoryAuditLogs = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return entry;
  },

  broadcastAnnouncement: (title: string, description: string, linkTo: string = 'dashboard'): void => {
    notificationService.addNotification({
      type: 'verification',
      title,
      description,
      linkTo
    });
    adminService.logAuditAction('SuperAdmin', `Broadcasted notification: "${title}"`, 'All Platform Users', 'Success');
  }
};
