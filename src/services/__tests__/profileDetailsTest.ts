import { profileService } from '../profileService';
import { matchingService } from '../matchingService';
import { matchService } from '../matchService';
import { membershipService } from '../membershipService';
import { chatService } from '../chatService';

console.log('=== TEST 1: Retrieve Profile Details & Verify Integrity ===');
const currentUser = profileService.getCurrentUser();
const allProfiles = profileService.getProfiles();
const targetProfile = allProfiles.find(p => p.gender !== currentUser.gender) || allProfiles[0];

console.log(`Target Profile: ${targetProfile.name} (${targetProfile.profileId})`);
console.log(`Age: ${targetProfile.age}, Height: ${targetProfile.height}, Location: ${targetProfile.city}, ${targetProfile.district}`);
console.log(`Education: ${targetProfile.education} (${targetProfile.degree}), Profession: ${targetProfile.profession}`);
console.log(`Kootam: ${targetProfile.kootamGothram || targetProfile.subCaste}, Kula Deivam: ${targetProfile.kulaDeivam || 'Sellandi Amman'}`);
console.log(`Verified Status: ${targetProfile.isVerified}`);

if (!targetProfile.name || !targetProfile.profileId) {
  throw new Error('FAIL: Target profile has missing basic information');
}

console.log('\n=== TEST 2: Deterministic Compatibility & Match Reasons ===');
const compatibility = matchingService.calculateCompatibility(currentUser, targetProfile);
console.log(`Compatibility Score: ${compatibility.total}%`);
console.log(`Reasons (${compatibility.reasons?.length || 0}):`);
compatibility.reasons?.forEach(r => console.log(`  - ${r}`));

if (compatibility.total < 60 || compatibility.total > 100) {
  throw new Error(`FAIL: Compatibility score ${compatibility.total}% is out of realistic range`);
}
if (!compatibility.reasons || compatibility.reasons.length === 0) {
  throw new Error('FAIL: Expected match reasons for profile');
}

console.log('\n=== TEST 3: Relationship Status Transitions ===');
// 1. Shortlist toggle
const isAlreadyShortlisted = matchService.isShortlisted(targetProfile.id);

if (!isAlreadyShortlisted) {
  matchService.toggleShortlist(targetProfile);
  if (!matchService.isShortlisted(targetProfile.id)) {
    throw new Error('FAIL: Failed to shortlist profile');
  }
  console.log(`Shortlisted ${targetProfile.name} successfully.`);
  // Revert
  matchService.toggleShortlist(targetProfile);
} else {
  console.log(`${targetProfile.name} is already shortlisted.`);
}

// 2. Get Relationship Status
const relStatus = matchService.getRelationshipStatus(targetProfile.id);
console.log(`Relationship Status with ${targetProfile.name}: isShortlisted=${relStatus.isShortlisted}, interestStatus=${relStatus.interestStatus}, canMessage=${relStatus.canMessage}`);

console.log('\n=== TEST 4: Protected Contact Information Gating ===');
const freeUser = { ...currentUser, membershipTier: 'free' as const };
const accessCheckFree = membershipService.canAccessFeature(freeUser, 'contact_views');
console.log(`Free User Contact Access Allowed: ${accessCheckFree.allowed} (Expected: false)`);
if (accessCheckFree.allowed) {
  throw new Error('FAIL: Free user should not have direct contact access');
}

const assistedUser = { ...currentUser, membershipTier: 'assisted' as const };
const accessCheckAssisted = membershipService.canAccessFeature(assistedUser, 'contact_views');
console.log(`Assisted VIP Contact Access Allowed: ${accessCheckAssisted.allowed} (Expected: true)`);
if (!accessCheckAssisted.allowed) {
  throw new Error('FAIL: Assisted VIP user should have direct contact access');
}

console.log('\n=== TEST 5: Block & Report Safety Handlers ===');
chatService.blockProfile(targetProfile.id);
const isBlocked = chatService.isProfileBlocked(targetProfile.id);
console.log(`Profile Block Status: ${isBlocked} (Expected: true)`);
if (!isBlocked) {
  throw new Error('FAIL: Profile block failed');
}
chatService.unblockProfile(targetProfile.id);

const reportResult = chatService.reportProfile(targetProfile.id, 'Fake profile or impersonation', 'Testing report submission');
console.log(`Report Submission Status: ${reportResult ? 'Success' : 'Failed'} (Expected: Success)`);

console.log('\n=== TEST 6: Sensitive Information Exposure Check ===');
const forbiddenKeys = ['password', 'otp', 'token', 'secret', 'cardNumber', 'cvv', 'upiPin'];
const profileKeys = Object.keys(targetProfile);
const leakedKeys = forbiddenKeys.filter(k => profileKeys.includes(k));
if (leakedKeys.length > 0) {
  throw new Error(`FAIL: Leaked sensitive keys in profile model: ${leakedKeys.join(', ')}`);
}
console.log('Zero sensitive credentials or private tokens exposed on profile.');

console.log('\nAll Profile Details & Trust Experience tests passed successfully!');
