import { membershipService } from '../membershipService';
import { mockPlans } from '../../data/mockPlans';
import { mockProfiles } from '../../data/mockProfiles';

console.log('=== TEST 1: Retrieve Membership Plans ===');
const plans = membershipService.getPlans();
console.log(`Loaded ${plans.length} plans: ${plans.map(p => `${p.name} (₹${p.price})`).join(', ')}`);
if (plans.length !== 4) {
  throw new Error(`FAIL: Expected 4 plans, got ${plans.length}`);
}

console.log('\n=== TEST 2: Feature Gating Evaluation ===');
const freeUser = { ...mockProfiles[0], membershipTier: 'free' as any };
const goldUser = { ...mockProfiles[0], membershipTier: 'classic' as any };
const diamondUser = { ...mockProfiles[0], membershipTier: 'premium' as any };
const assistedUser = { ...mockProfiles[0], membershipTier: 'assisted' as any };

// Free user checks
const freeChatAccess = membershipService.canAccessFeature(freeUser, 'direct_messaging');
const freeContactAccess = membershipService.canAccessFeature(freeUser, 'contact_views');
const freeHoroscopeAccess = membershipService.canAccessFeature(freeUser, 'detailed_horoscope');
console.log(`Free User Chat Allowed: ${freeChatAccess.allowed} (Expected: false)`);
console.log(`Free User Contact Allowed: ${freeContactAccess.allowed} (Expected: false)`);
if (freeChatAccess.allowed || freeContactAccess.allowed) {
  throw new Error('FAIL: Free user should not have direct messaging or contact view permissions');
}

// Gold user checks
const goldChatAccess = membershipService.canAccessFeature(goldUser, 'direct_messaging');
const goldContactAccess = membershipService.canAccessFeature(goldUser, 'contact_views');
const goldManagerAccess = membershipService.canAccessFeature(goldUser, 'relationship_manager');
console.log(`Gold User Chat Allowed: ${goldChatAccess.allowed} (Expected: true)`);
console.log(`Gold User Contact Allowed: ${goldContactAccess.allowed} (Expected: true)`);
console.log(`Gold User Manager Allowed: ${goldManagerAccess.allowed} (Expected: false)`);
if (!goldChatAccess.allowed || !goldContactAccess.allowed || goldManagerAccess.allowed) {
  throw new Error('FAIL: Gold user permissions mismatch');
}

// Assisted user checks
const assistedManagerAccess = membershipService.canAccessFeature(assistedUser, 'relationship_manager');
console.log(`Assisted VIP Manager Allowed: ${assistedManagerAccess.allowed} (Expected: true)`);
if (!assistedManagerAccess.allowed) {
  throw new Error('FAIL: Assisted VIP user must have Relationship Manager access');
}

console.log('\n=== TEST 3: Process Upgrade & Transaction Logging ===');
const initialTxnCount = membershipService.getTransactions().length;
const selectedPlan = plans[2]; // Premium Diamond
const { transaction, updatedUser } = membershipService.processUpgrade(
  freeUser,
  selectedPlan,
  'UPI (GPAY)'
);

console.log(`Upgraded Transaction ID: ${transaction.id}, Invoice: ${transaction.invoiceNumber}`);
console.log(`Updated User Tier: ${updatedUser.membershipTier} (Expected: ${selectedPlan.id})`);
console.log(`Total Transactions now: ${membershipService.getTransactions().length} (Expected: ${initialTxnCount + 1})`);

if (updatedUser.membershipTier !== selectedPlan.id) {
  throw new Error('FAIL: User tier was not updated to new plan id');
}

console.log('\n=== TEST 4: Sensitive Data Safeguard Check ===');
const txnKeys = Object.keys(transaction);
const forbiddenKeys = ['cardNumber', 'cvv', 'password', 'upiPin', 'secret'];
const foundForbidden = forbiddenKeys.filter(k => txnKeys.includes(k));
if (foundForbidden.length > 0) {
  throw new Error(`FAIL: Sensitive keys found in transaction: ${foundForbidden.join(', ')}`);
}
console.log('No sensitive credentials or payment secrets present in transaction record.');

console.log('\nAll Membership & Premium feature tests passed successfully!');
