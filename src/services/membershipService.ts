import { MembershipPlan, Profile } from '../types';
import { mockPlans } from '../data/mockPlans';
import { notificationService } from './notificationService';

export interface MembershipTransaction {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  date: string;
  expiryDate: string;
  durationMonths: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  invoiceNumber: string;
  contactViewsGranted: number;
}

const STORAGE_TRANSACTIONS_KEY = 'knm_membership_transactions';
let memoryTransactions: MembershipTransaction[] | null = null;

export const membershipService = {
  getPlans: (): MembershipPlan[] => {
    return mockPlans;
  },

  getPlanById: (planId: string): MembershipPlan | undefined => {
    return mockPlans.find(p => p.id === planId);
  },

  getTransactions: (): MembershipTransaction[] => {
    if (memoryTransactions) {
      return memoryTransactions;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_TRANSACTIONS_KEY);
        if (stored) {
          memoryTransactions = JSON.parse(stored);
          return memoryTransactions!;
        }
      }
    } catch {
      // ignore
    }

    const defaultTransactions: MembershipTransaction[] = [
      {
        id: 'TXN_KNM_89412',
        planId: 'classic',
        planName: 'Classic Gold',
        amount: 3499,
        date: '2025-01-15',
        expiryDate: '2025-04-15',
        durationMonths: 3,
        paymentMethod: 'UPI (GPay)',
        status: 'completed',
        invoiceNumber: 'INV-2025-0811',
        contactViewsGranted: 30,
      }
    ];

    memoryTransactions = defaultTransactions;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(defaultTransactions));
      }
    } catch {
      // ignore
    }

    return defaultTransactions;
  },

  processUpgrade: (
    user: Profile,
    plan: MembershipPlan,
    paymentMethod: string
  ): { transaction: MembershipTransaction; updatedUser: Partial<Profile> } => {
    const list = [...membershipService.getTransactions()];
    const now = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + plan.durationMonths);

    const transaction: MembershipTransaction = {
      id: `TXN_KNM_${Date.now().toString().slice(-6)}`,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      date: now.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      durationMonths: plan.durationMonths,
      paymentMethod,
      status: 'completed',
      invoiceNumber: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      contactViewsGranted: plan.contactViews,
    };

    list.unshift(transaction);
    memoryTransactions = list;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }

    // Add notification
    notificationService.addNotification({
      type: 'verification',
      title: 'Membership Upgraded!',
      description: `Your ${plan.name} subscription is now active with ${plan.contactViews} verified contact views.`,
      linkTo: 'membership'
    });

    const updatedUser: Partial<Profile> = {
      membershipTier: plan.id as any,
    };

    return { transaction, updatedUser };
  },

  /**
   * Centralized Feature Gating Check
   */
  canAccessFeature: (
    user: Profile | null | undefined,
    feature:
      | 'direct_messaging'
      | 'contact_views'
      | 'detailed_horoscope'
      | 'relationship_manager'
      | 'profile_highlight'
      | 'advanced_filters'
  ): { allowed: boolean; requiredPlan: string; message: string } => {
    const tier = user?.membershipTier || 'free';

    switch (feature) {
      case 'direct_messaging':
        if (tier === 'classic' || tier === 'premium' || tier === 'assisted') {
          return { allowed: true, requiredPlan: 'Classic Gold', message: 'Direct in-app messaging is unlocked.' };
        }
        return {
          allowed: false,
          requiredPlan: 'Classic Gold',
          message: 'Direct messaging requires a Classic Gold or Premium membership.'
        };

      case 'contact_views':
        if (tier === 'classic' || tier === 'premium' || tier === 'assisted') {
          return { allowed: true, requiredPlan: 'Classic Gold', message: 'Verified phone numbers unlocked.' };
        }
        return {
          allowed: false,
          requiredPlan: 'Classic Gold',
          message: 'Accessing verified phone numbers requires an active membership.'
        };

      case 'detailed_horoscope':
        if (tier !== 'free') {
          return { allowed: true, requiredPlan: 'Classic Gold', message: '10-Porutham Vedic analysis available.' };
        }
        return {
          allowed: false,
          requiredPlan: 'Classic Gold',
          message: 'Full Vedic 10-Porutham chart analysis requires an active membership.'
        };

      case 'relationship_manager':
        if (tier === 'assisted') {
          return { allowed: true, requiredPlan: 'Assisted Matrimony VIP', message: 'Dedicated Relationship Manager active.' };
        }
        return {
          allowed: false,
          requiredPlan: 'Assisted Matrimony VIP',
          message: 'Personal Relationship Manager is exclusive to Assisted Matrimony VIP members.'
        };

      case 'profile_highlight':
        if (tier === 'premium' || tier === 'assisted') {
          return { allowed: true, requiredPlan: 'Premium Diamond', message: 'Priority profile highlight active.' };
        }
        return {
          allowed: false,
          requiredPlan: 'Premium Diamond',
          message: 'Top-tier profile placement in search results is available for Premium Diamond members.'
        };

      case 'advanced_filters':
        return { allowed: true, requiredPlan: 'Free Basic', message: 'All filters accessible.' };

      default:
        return { allowed: true, requiredPlan: 'Free', message: 'Accessible' };
    }
  }
};
