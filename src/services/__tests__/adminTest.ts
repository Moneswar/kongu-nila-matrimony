import { adminService } from '../adminService';
import { profileService } from '../profileService';
import { membershipService } from '../membershipService';
import { notificationService } from '../notificationService';

console.log('=== TEST 1: Retrieve Admin Statistics ===');
const stats = adminService.getStats();
console.log(`Total Users: ${stats.totalUsers}`);
console.log(`Verified Profiles: ${stats.verifiedProfiles}`);
console.log(`Premium Subscribers: ${stats.premiumSubscribers}`);
console.log(`Pending Verifications: ${stats.pendingVerifications}`);
console.log(`Open Safety Reports: ${stats.openReports}`);
console.log(`Total Revenue: ₹${stats.totalRevenueInr.toLocaleString()}`);

if (stats.totalUsers <= 0 || stats.verifiedProfiles <= 0) {
  throw new Error('FAIL: Admin statistics invalid or empty');
}

console.log('\n=== TEST 2: Verification Queue Management ===');
const verifications = adminService.getVerificationRequests();
console.log(`Initial Verifications Queue: ${verifications.length} items`);
if (verifications.length === 0) {
  throw new Error('FAIL: Expected verification queue items');
}

const targetReq = verifications[0];
const approvedList = adminService.updateVerificationStatus(targetReq.id, 'approved');
const updatedReq = approvedList.find(v => v.id === targetReq.id);
console.log(`Updated Verification ID: ${targetReq.id} -> Status: ${updatedReq?.status} (Expected: approved)`);
if (updatedReq?.status !== 'approved') {
  throw new Error('FAIL: Verification status was not updated to approved');
}

console.log('\n=== TEST 3: Safety Reports Moderation ===');
const reports = adminService.getReports();
console.log(`Initial Reports: ${reports.length} items`);
if (reports.length === 0) {
  throw new Error('FAIL: Expected safety reports');
}

const targetReport = reports[0];
const resolvedList = adminService.updateReportStatus(targetReport.id, 'resolved', 'Audited by Admin');
const updatedReport = resolvedList.find(r => r.id === targetReport.id);
console.log(`Updated Report ID: ${targetReport.id} -> Status: ${updatedReport?.status} (Expected: resolved)`);
if (updatedReport?.status !== 'resolved') {
  throw new Error('FAIL: Report status was not updated to resolved');
}

console.log('\n=== TEST 4: Audit Logging ===');
const initialLogCount = adminService.getAuditLogs().length;
const newAudit = adminService.logAuditAction('SuperAdmin', 'Approved Aadhaar KYC', 'Sowmya S (KNM-2024-811)', 'Success');
console.log(`New Audit Entry: "${newAudit.action}" for ${newAudit.target} (ID: ${newAudit.id})`);
const logCountAfter = adminService.getAuditLogs().length;
console.log(`Total Audit Logs now: ${logCountAfter} (Expected: ${initialLogCount + 1})`);
if (logCountAfter !== initialLogCount + 1) {
  throw new Error('FAIL: Audit log entry was not persisted');
}

console.log('\n=== TEST 5: Broadcast Platform Announcement ===');
const notifCountBefore = notificationService.getNotifications().length;
adminService.broadcastAnnouncement(
  'Kongu Community Matrimony Meetup 2025',
  'Exclusive family matrimonial convention scheduled in Coimbatore on Sunday.'
);
const notifCountAfter = notificationService.getNotifications().length;
console.log(`Notifications count after broadcast: ${notifCountAfter} (Expected: ${notifCountBefore + 1})`);
if (notifCountAfter !== notifCountBefore + 1) {
  throw new Error('FAIL: Broadcast notification was not delivered');
}

console.log('\n=== TEST 6: Sensitive Credentials Security Check ===');
const forbiddenKeys = ['password', 'otp', 'token', 'secret', 'cardNumber', 'cvv', 'upiPin'];
const statsKeys = Object.keys(stats);
const verifKeys = Object.keys(verifications[0]);
const reportKeys = Object.keys(reports[0]);

const leakedKeys = forbiddenKeys.filter(k =>
  statsKeys.includes(k) || verifKeys.includes(k) || reportKeys.includes(k)
);
if (leakedKeys.length > 0) {
  throw new Error(`FAIL: Leaked sensitive keys in admin models: ${leakedKeys.join(', ')}`);
}
console.log('Zero sensitive credentials or secrets exposed in admin data structures.');

console.log('\nAll Admin Dashboard & Platform Management tests passed successfully!');
