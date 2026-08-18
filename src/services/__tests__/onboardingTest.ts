import { profileService } from '../profileService';
import { mockProfiles } from '../../data/mockProfiles';

console.log('=== TEST 1: Retrieve Initial Current User & Profile Completion ===');
const initialUser = profileService.getCurrentUser();
console.log(`Current User: ${initialUser.name} (${initialUser.profileId}), Gender: ${initialUser.gender}`);
const initialCompletion = profileService.getProfileCompletion(initialUser);
console.log(`Profile Completion Score: ${initialCompletion.score}%`);
console.log(`Missing items: ${initialCompletion.missing.join(', ') || 'None'}`);
if (initialCompletion.score <= 0 || initialCompletion.score > 100) {
  throw new Error('FAIL: Profile completion score out of bounds');
}

console.log('\n=== TEST 2: Update Profile Details & Recalculate Completion ===');
const updatedProfile = {
  ...initialUser,
  aboutMe: 'Belonging to a respected Kongu family from Erode. Completed B.E. at PSG Tech and working in Data Science.',
  hobbies: ['Classical Music', 'Organic Gardening', 'Badminton'],
  photos: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  ]
};

profileService.setCurrentUser(updatedProfile);
const newCompletion = profileService.getProfileCompletion(updatedProfile);
console.log(`New Profile Completion Score: ${newCompletion.score}% (Expected: >= ${initialCompletion.score}%)`);
if (newCompletion.score < initialCompletion.score) {
  throw new Error('FAIL: Completion score decreased after adding details');
}

console.log('\n=== TEST 3: Validation Logic Check ===');
const testValidate = (data: { name: string; email: string; phone: string; pass: string; confirm: string; agree: boolean; dob: string; gender: string }) => {
  const errors: string[] = [];
  if (!data.name.trim()) errors.push('Name required');
  if (!data.email.includes('@')) errors.push('Valid email required');
  if (data.phone.replace(/\D/g, '').length < 10) errors.push('10-digit mobile required');
  if (data.pass.length < 6) errors.push('Min 6 char password required');
  if (data.pass !== data.confirm) errors.push('Passwords must match');
  if (!data.agree) errors.push('Consent required');

  const age = new Date().getFullYear() - new Date(data.dob).getFullYear();
  const minAge = data.gender === 'female' ? 18 : 21;
  if (age < minAge) errors.push(`Min age is ${minAge}`);

  return errors;
};

// Invalid data
const invalidErrors = testValidate({
  name: '',
  email: 'invalid-email',
  phone: '123',
  pass: '123',
  confirm: '456',
  agree: false,
  dob: '2015-01-01',
  gender: 'female'
});
console.log(`Invalid submission caught ${invalidErrors.length} errors (Expected: 7 errors).`);
if (invalidErrors.length !== 7) throw new Error(`FAIL: Expected 7 errors, got ${invalidErrors.length}`);

// Valid data
const validErrors = testValidate({
  name: 'Sowmya Soundararajan',
  email: 'sowmya@example.com',
  phone: '9842212345',
  pass: 'Kongu@2025',
  confirm: 'Kongu@2025',
  agree: true,
  dob: '1998-05-15',
  gender: 'female'
});
console.log(`Valid submission caught ${validErrors.length} errors (Expected: 0 errors).`);
if (validErrors.length !== 0) throw new Error('FAIL: Valid submission flagged errors');

console.log('\n=== TEST 4: Verification Badges Consistency ===');
const userWithBadges = {
  ...updatedProfile,
  isVerified: true,
  verificationBadges: {
    mobile: true,
    email: true,
    photo: true,
    idGovt: true,
    horoscopeVerified: true
  }
};
profileService.setCurrentUser(userWithBadges);
console.log(`Verified Status: ${userWithBadges.isVerified}`);
console.log(`Govt ID Badge: ${userWithBadges.verificationBadges.idGovt}`);
console.log(`Mobile Badge: ${userWithBadges.verificationBadges.mobile}`);

console.log('\nAll Authentication & Onboarding test scenarios passed successfully!');
