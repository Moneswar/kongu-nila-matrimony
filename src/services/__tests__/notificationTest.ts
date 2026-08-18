import { notificationService } from '../notificationService';

console.log('=== TEST 1: Retrieve Initial Notifications & Unread Count ===');
const initialList = notificationService.getNotifications();
const unreadCount = notificationService.getUnreadCount();
console.log(`Loaded ${initialList.length} notifications (${unreadCount} unread).`);
if (initialList.length === 0) {
  throw new Error('FAIL: Expected initial notifications list');
}

console.log('\n=== TEST 2: Add Real-Event Notifications ===');
const interestNotif = notificationService.addNotification({
  type: 'interest',
  title: 'Interest Received',
  description: 'Gowtham Thangavel expressed interest in your profile.',
  linkTo: 'interests',
  priority: 'normal'
});
console.log(`Created Notification: ${interestNotif.title} (ID: ${interestNotif.id})`);
const unreadAfterAdd = notificationService.getUnreadCount();
if (unreadAfterAdd !== unreadCount + 1) {
  throw new Error('FAIL: Unread count did not increment after adding notification');
}

console.log('\n=== TEST 3: Mark as Read & Mark All as Read ===');
notificationService.markAsRead(interestNotif.id);
const unreadAfterMarkSingle = notificationService.getUnreadCount();
console.log(`Unread count after marking single: ${unreadAfterMarkSingle}`);
if (unreadAfterMarkSingle !== unreadCount) {
  throw new Error('FAIL: Unread count did not decrement');
}

notificationService.markAllAsRead();
const unreadAfterMarkAll = notificationService.getUnreadCount();
console.log(`Unread count after marking all read: ${unreadAfterMarkAll} (Expected: 0)`);
if (unreadAfterMarkAll !== 0) {
  throw new Error('FAIL: Expected 0 unread notifications after markAllAsRead');
}

console.log('\n=== TEST 4: Notification Grouping (Today, Yesterday, Earlier) ===');
const groups = notificationService.groupNotifications(notificationService.getNotifications());
console.log(`Grouped Notifications -> Today: ${groups.today.length}, Yesterday: ${groups.yesterday.length}, Earlier: ${groups.earlier.length}`);
if (groups.today.length === 0 && groups.yesterday.length === 0 && groups.earlier.length === 0) {
  throw new Error('FAIL: Expected grouped notification items');
}

console.log('\n=== TEST 5: Delete Notification ===');
const countBeforeDelete = notificationService.getNotifications().length;
notificationService.deleteNotification(interestNotif.id);
const countAfterDelete = notificationService.getNotifications().length;
console.log(`Count Before Delete: ${countBeforeDelete}, After Delete: ${countAfterDelete}`);
if (countAfterDelete !== countBeforeDelete - 1) {
  throw new Error('FAIL: Notification was not removed on delete');
}

console.log('\n=== TEST 6: Notification Preferences & Mandatory Security Lock ===');
const initialPrefs = notificationService.getNotificationPreferences();
console.log('Initial In-App Preference:', initialPrefs.inApp);
console.log('Security Alerts (Email):', initialPrefs.email.securityAlerts);
console.log('Security Alerts (SMS):', initialPrefs.sms.securityAlerts);

// Attempt to disable security alerts (should remain true)
const updatedPrefs = notificationService.updateNotificationPreferences({
  email: {
    ...initialPrefs.email,
    interestReceived: false,
    securityAlerts: false as any // Attempt override
  }
});
if (!updatedPrefs.email.securityAlerts) {
  throw new Error('FAIL: Security alerts should be strictly mandatory and non-disableable');
}
console.log('Mandatory security lock verified.');

console.log('\n=== TEST 7: Security & Secrets Safeguard Check ===');
const forbiddenKeys = ['smtpPassword', 'smtpUser', 'smsApiKey', 'twilioSecret', 'pushSecret', 'sendgridKey'];
const keysInService = Object.keys(notificationService);
const leakedKeys = forbiddenKeys.filter(k => keysInService.includes(k));
if (leakedKeys.length > 0) {
  throw new Error(`FAIL: Leaked provider secret in notificationService: ${leakedKeys.join(', ')}`);
}
console.log('Zero communication provider credentials or API secrets exposed.');

console.log('\nAll Notifications & Communication System tests passed successfully!');
