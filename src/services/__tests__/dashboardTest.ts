import { profileService } from '../profileService';
import { matchingService } from '../matchingService';
import { matchService } from '../matchService';
import { chatService } from '../chatService';
import { notificationService } from '../notificationService';
import { membershipService } from '../membershipService';

console.log('=== TEST 1: Retrieve Current User & Metrics for Dashboard ===');
const currentUser = profileService.getCurrentUser();
const allProfiles = profileService.getProfiles();
console.log(`User: ${currentUser.name} (${currentUser.profileId})`);

const completion = profileService.getProfileCompletion(currentUser);
console.log(`Profile Completion: ${completion.score}% (Missing: ${completion.missing.join(', ') || 'None'})`);

const matches = matchingService.getRecommendations(currentUser, allProfiles);
console.log(`Total Recommended Matches: ${matches.length}`);
if (matches.length === 0) {
  throw new Error('FAIL: Expected recommended matches for user');
}

const shortlists = matchService.getShortlists();
const interests = matchService.getInterests();
const conversations = chatService.getConversations();
console.log(`Shortlists: ${shortlists.length}, Interests: ${interests.length}, Conversations: ${conversations.length}`);

console.log('\n=== TEST 2: Notification Center State Management ===');
const initialNotifications = notificationService.getNotifications();
const initialUnreadCount = notificationService.getUnreadCount();
console.log(`Total Notifications: ${initialNotifications.length}, Unread: ${initialUnreadCount}`);

// Add a test notification
const newNotif = notificationService.addNotification({
  type: 'interest',
  title: 'Interest Received',
  description: 'A prospective bride from Coimbatore sent an interest.',
  linkTo: 'interests'
});
console.log(`Added Notification: ${newNotif.title} (ID: ${newNotif.id})`);

const countAfterAdd = notificationService.getUnreadCount();
console.log(`Unread Count after adding: ${countAfterAdd} (Expected: ${initialUnreadCount + 1})`);
if (countAfterAdd !== initialUnreadCount + 1) {
  throw new Error('FAIL: Unread notification count did not increment');
}

// Mark single notification read
notificationService.markAsRead(newNotif.id);
const countAfterSingleRead = notificationService.getUnreadCount();
console.log(`Unread Count after marking 1 read: ${countAfterSingleRead} (Expected: ${initialUnreadCount})`);
if (countAfterSingleRead !== initialUnreadCount) {
  throw new Error('FAIL: Unread notification count did not decrement');
}

// Mark all read
notificationService.markAllAsRead();
const countAfterAllRead = notificationService.getUnreadCount();
console.log(`Unread Count after marking all read: ${countAfterAllRead} (Expected: 0)`);
if (countAfterAllRead !== 0) {
  throw new Error('FAIL: All notifications should be read');
}

console.log('\n=== TEST 3: Membership Status Extraction ===');
const currentPlan = membershipService.getPlanById(currentUser.membershipTier);
console.log(`User Membership Tier: ${currentUser.membershipTier} -> Plan: ${currentPlan?.name || 'Free Basic'}`);

console.log('\nAll Dashboard, Notification & User Activity tests passed successfully!');
