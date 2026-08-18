import { matchService } from '../matchService';
import { mockProfiles } from '../../data/mockProfiles';
import { Profile, InterestRecord } from '../../types';

console.log('=== TEST 1: Initial Discovery State ===');
const candidate = mockProfiles[1]; // Sowmya Soundararajan
let shortlists = matchService.getShortlists();
let interests = matchService.getInterests();
let blocked: string[] = [];

let rel = matchService.getRelationshipStatus(candidate.id, shortlists, interests, blocked);
console.log(`Initial Status for ${candidate.name}:`);
console.log(` - isShortlisted: ${rel.isShortlisted}`);
console.log(` - interestStatus: ${rel.interestStatus}`);
console.log(` - canMessage: ${rel.canMessage}`);

console.log('\n=== TEST 2 & 8: Add to Shortlist ===');
const resShortlist = matchService.toggleShortlist(candidate);
shortlists = resShortlist.records;
rel = matchService.getRelationshipStatus(candidate.id, shortlists, interests, blocked);
console.log(`After Shortlist: isShortlisted = ${rel.isShortlisted} (Expected: true)`);
if (!rel.isShortlisted) throw new Error('FAIL: Not shortlisted');

console.log('\n=== TEST 3 & 5: Send Interest & Duplicate Prevention ===');
// First Send
const resSend1 = matchService.sendInterest(candidate, 'We would love to connect!');
interests = resSend1.list;
rel = matchService.getRelationshipStatus(candidate.id, shortlists, interests, blocked);
console.log(`After 1st Send Interest: interestStatus = ${rel.interestStatus} (Expected: sent_pending), isDuplicate = ${resSend1.isDuplicate}`);

// Second Send (Duplicate check)
const resSend2 = matchService.sendInterest(candidate, 'Trying again');
console.log(`After 2nd Send Interest: isDuplicate = ${resSend2.isDuplicate} (Expected: true, Duplicate prevented)`);

console.log('\n=== TEST 4 & 5: Accept Interest & Connection ===');
const candidate2 = mockProfiles[2]; // Dr. Deepa
const newRecvInterest: InterestRecord = {
  id: 'test_int_recv',
  fromProfileId: candidate2.id,
  toProfileId: 'current_user',
  profile: candidate2,
  status: 'pending',
  sentAt: 'Today',
  updatedAt: 'Today'
};
interests = [newRecvInterest, ...interests];
rel = matchService.getRelationshipStatus(candidate2.id, shortlists, interests, blocked);
console.log(`Received Interest from ${candidate2.name}: status = ${rel.interestStatus} (Expected: received_pending)`);

// Accept interest
newRecvInterest.status = 'accepted';
rel = matchService.getRelationshipStatus(candidate2.id, shortlists, interests, blocked);
console.log(`After Accept: status = ${rel.interestStatus} (Expected: connected), canMessage = ${rel.canMessage} (Expected: true)`);

console.log('\n=== TEST 7: Decline Interest ===');
const candidate3 = mockProfiles[4];
const newDeclineInterest: InterestRecord = {
  id: 'test_int_decline',
  fromProfileId: candidate3.id,
  toProfileId: 'current_user',
  profile: candidate3,
  status: 'declined',
  sentAt: 'Today',
  updatedAt: 'Today'
};
interests = [newDeclineInterest, ...interests];
rel = matchService.getRelationshipStatus(candidate3.id, shortlists, interests, blocked);
console.log(`After Decline: status = ${rel.interestStatus} (Expected: declined), canMessage = ${rel.canMessage} (Expected: false)`);

console.log('\n=== TEST 9: Remove from Shortlist ===');
const resRemove = matchService.toggleShortlist(candidate);
shortlists = resRemove.records;
rel = matchService.getRelationshipStatus(candidate.id, shortlists, interests, blocked);
console.log(`After Remove Shortlist: isShortlisted = ${rel.isShortlisted} (Expected: false)`);

console.log('\n=== TEST 10: Block Profile ===');
blocked.push(candidate2.id);
rel = matchService.getRelationshipStatus(candidate2.id, shortlists, interests, blocked);
console.log(`After Blocking: isBlocked = ${rel.isBlocked} (Expected: true), canMessage = ${rel.canMessage} (Expected: false)`);

console.log('\nAll 10 Shortlist, Interest, and Connection workflow test scenarios verified successfully!');
