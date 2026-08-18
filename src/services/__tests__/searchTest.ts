import { searchService, defaultSearchFilters } from '../searchService';
import { profileService } from '../profileService';
import { chatService } from '../chatService';

console.log('=== TEST 1: Default Search Execution ===');
const currentUser = profileService.getCurrentUser();
const defaultResults = searchService.filterProfiles(defaultSearchFilters, currentUser);
console.log(`Default Search Matches: ${defaultResults.length}`);
if (defaultResults.length === 0) {
  throw new Error('FAIL: Expected search results for default filter');
}
if (defaultResults.some(p => p.id === currentUser.id)) {
  throw new Error('FAIL: Current user was not excluded from search results');
}

console.log('\n=== TEST 2: Blocked Profile Exclusion ===');
const firstCandidate = defaultResults[0];
chatService.blockProfile(firstCandidate.id);
const resultsAfterBlock = searchService.filterProfiles(defaultSearchFilters, currentUser);
const isBlockedCandidatePresent = resultsAfterBlock.some(p => p.id === firstCandidate.id);
console.log(`Blocked Candidate (${firstCandidate.name}) Present in Search: ${isBlockedCandidatePresent} (Expected: false)`);
if (isBlockedCandidatePresent) {
  throw new Error('FAIL: Blocked candidate appeared in search results');
}
// Clean up unblock
chatService.unblockProfile(firstCandidate.id);

console.log('\n=== TEST 3: Multi-Criteria Filter Application ===');
// Filter for Coimbatore locations
const locationResults = searchService.filterProfiles({
  ...defaultSearchFilters,
  locations: ['Coimbatore']
}, currentUser);
console.log(`Coimbatore Matches: ${locationResults.length}`);
locationResults.forEach(p => {
  const isCbe = p.district.toLowerCase().includes('coimbatore') || p.city.toLowerCase().includes('coimbatore');
  if (!isCbe) {
    throw new Error(`FAIL: Profile ${p.name} (${p.district}) does not match Coimbatore filter`);
  }
});

// Filter for Minimum Annual Income (15L+)
const incomeResults = searchService.filterProfiles({
  ...defaultSearchFilters,
  incomeMin: 15
}, currentUser);
console.log(`Income 15L+ Matches: ${incomeResults.length}`);
incomeResults.forEach(p => {
  if ((p.annualIncomeNumber || 0) < 15) {
    throw new Error(`FAIL: Profile ${p.name} income (${p.annualIncomeNumber}) is less than 15L`);
  }
});

console.log('\n=== TEST 4: Search Based on Partner Preferences ===');
const prefFilters = searchService.getFiltersFromPartnerPreferences(currentUser);
const prefResults = searchService.filterProfiles(prefFilters, currentUser);
console.log(`Preference-Based Matches: ${prefResults.length} (Gender target: ${prefFilters.gender})`);
if (prefFilters.gender !== 'female') {
  throw new Error(`FAIL: Expected target gender female for male user, got ${prefFilters.gender}`);
}

console.log('\n=== TEST 5: Sorting Order Evaluation ===');
const sortedByAgeAsc = searchService.filterProfiles({
  ...defaultSearchFilters,
  sortBy: 'age_asc'
}, currentUser);
for (let i = 0; i < sortedByAgeAsc.length - 1; i++) {
  if (sortedByAgeAsc[i].age > sortedByAgeAsc[i + 1].age) {
    throw new Error('FAIL: Results not sorted in ascending age order');
  }
}
console.log('Age ascending sorting validated.');

console.log('\n=== TEST 6: Saved Search Management ===');
const initialSavedCount = searchService.getSavedSearches().length;
const newSaved = searchService.saveSearch('Test Saved Search', defaultSearchFilters, 10);
console.log(`Saved Search Created: ${newSaved.title} (ID: ${newSaved.id})`);
const countAfterSave = searchService.getSavedSearches().length;
if (countAfterSave !== initialSavedCount + 1) {
  throw new Error('FAIL: Saved search was not added');
}

searchService.deleteSavedSearch(newSaved.id);
const countAfterDelete = searchService.getSavedSearches().length;
if (countAfterDelete !== initialSavedCount) {
  throw new Error('FAIL: Saved search was not deleted');
}

console.log('\nAll Advanced Search, Filters & Profile Discovery tests passed successfully!');
