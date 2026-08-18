import { chatService } from '../chatService';
import { mockProfiles } from '../../data/mockProfiles';

console.log('=== TEST 1: Retrieve Conversation List ===');
const convos = chatService.getConversations();
console.log(`Found ${convos.length} conversations.`);
if (convos.length === 0) throw new Error('FAIL: No conversations returned');
const firstConvo = convos[0];
console.log(`First Convo Partner: ${firstConvo.partnerProfile.name} (${firstConvo.partnerProfile.profileId})`);
console.log(`Unread Count: ${firstConvo.unreadCount}, Messages: ${firstConvo.messages.length}`);

console.log('\n=== TEST 2: Search Conversations ===');
const searchQuery = 'Sowmya';
const searchResults = convos.filter(
  c => c.partnerProfile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.partnerProfile.profileId.toLowerCase().includes(searchQuery.toLowerCase())
);
console.log(`Search for "${searchQuery}" returned ${searchResults.length} matches (Expected: >= 1).`);
if (searchResults.length === 0) throw new Error('FAIL: Search returned 0 matches');

console.log('\n=== TEST 3: Send Valid Message ===');
const candidate = mockProfiles[0];
const textToSend = '  Vanakkam! Looking forward to our family introductory call on Sunday.  ';
const updatedConvo = chatService.sendMessage(candidate, textToSend);
const sentMsg = updatedConvo.messages[updatedConvo.messages.length - 1];
console.log(`Sent Message Text: "${sentMsg.text}" (Expected trimmed: "${textToSend.trim()}")`);
console.log(`Status: ${sentMsg.status} (Expected: sent)`);
console.log(`Sender ID: ${sentMsg.senderId} (Expected: current_user)`);
console.log(`Receiver ID: ${sentMsg.receiverId} (Expected: ${candidate.id})`);
if (sentMsg.text !== textToSend.trim()) throw new Error('FAIL: Message text was not trimmed');
if (sentMsg.status !== 'sent') throw new Error('FAIL: Message status is not sent');

console.log('\n=== TEST 4: Mark Conversation as Read ===');
const readConvos = chatService.markAsRead(candidate.id);
const updatedCandidateConvo = readConvos.find(c => c.partnerProfile.id === candidate.id);
console.log(`Unread Count after markAsRead: ${updatedCandidateConvo?.unreadCount} (Expected: 0)`);
if (updatedCandidateConvo?.unreadCount !== 0) throw new Error('FAIL: Unread count did not reset to 0');

console.log('\n=== TEST 5: Block & Unblock Profile ===');
chatService.blockProfile(candidate.id);
const isBlocked = chatService.isProfileBlocked(candidate.id);
console.log(`isProfileBlocked after blocking: ${isBlocked} (Expected: true)`);
if (!isBlocked) throw new Error('FAIL: Profile is not blocked');

chatService.unblockProfile(candidate.id);
const isUnblocked = !chatService.isProfileBlocked(candidate.id);
console.log(`isProfileBlocked after unblocking: ${!isUnblocked} (Expected: false)`);
if (!isUnblocked) throw new Error('FAIL: Profile is still blocked');

console.log('\n=== TEST 6: Report Profile ===');
chatService.reportProfile(candidate.id, 'Fake Profile', 'Test reporting flow');
console.log('Report submitted successfully without errors.');

console.log('\n=== TEST 7: Clear Conversation ===');
const clearedConvos = chatService.clearConversation(updatedConvo.id);
const clearedConvo = clearedConvos.find(c => c.id === updatedConvo.id);
console.log(`Messages count after clear: ${clearedConvo?.messages.length} (Expected: 0)`);
if (clearedConvo?.messages.length !== 0) throw new Error('FAIL: Conversation not cleared');

console.log('\nAll Messaging & Chat system test scenarios passed successfully!');
