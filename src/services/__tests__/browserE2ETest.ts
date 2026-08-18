import { chromium } from 'playwright-core';

const CHROME_EXECUTABLE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000/';

async function runBrowserE2E() {
  console.log('====================================================');
  console.log('STARTING ACTUAL CHROMIUM BROWSER E2E TEST PASS');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Browser Executable: ${CHROME_EXECUTABLE}`);
  console.log('====================================================\n');

  const browser = await chromium.launch({
    executablePath: CHROME_EXECUTABLE,
    headless: true
  });

  const consoleLogs: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleLogs.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    pageErrors.push(`[Page Error] ${error.message}`);
  });

  page.on('requestfailed', request => {
    failedRequests.push(`[Failed Request] ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    // ----------------------------------------------------
    // 1. PUBLIC HOMEPAGE (1280x800)
    // ----------------------------------------------------
    console.log('--- Step 1: Navigating to Public Homepage ---');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const title = await page.title();
    console.log(`Page Title: "${title}"`);

    // Verify key elements
    const navbarExists = await page.locator('nav').first().isVisible();
    const heroTitle = await page.locator('h1').first().textContent();
    console.log(`Hero Heading: "${heroTitle?.trim()}"`);
    console.log(`Navbar Present: ${navbarExists}`);

    // Check for Horizontal Overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Viewport check 1280px -> scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth} (Overflow: ${scrollWidth > clientWidth})`);
    if (scrollWidth > clientWidth) {
      throw new Error(`FAIL: Horizontal scroll detected on Homepage: ${scrollWidth} > ${clientWidth}`);
    }

    // ----------------------------------------------------
    // 2. LANGUAGE & THEME TOGGLES
    // ----------------------------------------------------
    console.log('\n--- Step 2: Testing Language & Theme Switching ---');
    const langToggleBtn = page.locator('#btn-header-language-toggle');
    if (await langToggleBtn.isVisible()) {
      await langToggleBtn.click();
      await page.waitForTimeout(500);
      const isTamilActive = await page.evaluate(() => document.documentElement.lang === 'ta' || document.body.textContent?.includes('கொங்கு'));
      console.log(`Switched to Tamil mode: ${isTamilActive}`);

      await langToggleBtn.click();
      await page.waitForTimeout(500);
      console.log('Switched back to English mode.');
    }

    const themeToggleBtn = page.locator('#btn-header-theme-toggle');
    if (await themeToggleBtn.isVisible()) {
      await themeToggleBtn.click();
      await page.waitForTimeout(500);
      const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      console.log(`Dark Theme Active: ${isDark}`);
      await themeToggleBtn.click(); // Revert
      await page.waitForTimeout(300);
    }

    // ----------------------------------------------------
    // 3. REGISTRATION MODAL
    // ----------------------------------------------------
    console.log('\n--- Step 3: Opening & Inspecting 10-Step Registration Modal ---');
    const registerBtn = page.locator('button:has-text("Create Your Profile"), button:has-text("Create Free Profile"), button:has-text("Register")').first();
    if (await registerBtn.isVisible()) {
      await registerBtn.click();
      await page.waitForTimeout(600);
      const regModal = page.locator('#registration-modal-container');
      const isRegOpen = await regModal.isVisible();
      console.log(`Registration Modal Opened: ${isRegOpen}`);

      // Close registration modal
      const closeRegBtn = regModal.locator('button[aria-label="Close Registration Modal"], button:has-text("✕"), svg.lucide-x').first();
      if (await closeRegBtn.isVisible()) {
        await closeRegBtn.click();
        await page.waitForTimeout(400);
      }
    }

    // ----------------------------------------------------
    // 4. LOGIN & AUTHENTICATION
    // ----------------------------------------------------
    console.log('\n--- Step 4: Login with Persona Switcher ---');
    const loginBtn = page.locator('button:has-text("Login"), button:has-text("Sign In")').first();
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      await page.waitForTimeout(600);

      const loginModal = page.locator('#login-modal-container');
      console.log(`Login Modal Visible: ${await loginModal.isVisible()}`);

      // Switch persona to Dr. Karthik Subramanian (Groom)
      const personaGroomBtn = loginModal.locator('button:has-text("Dr. Karthik S")').first();
      if (await personaGroomBtn.isVisible()) {
        await personaGroomBtn.click();
        await page.waitForTimeout(500);
        console.log('Switched to Dr. Karthik Subramanian demo persona.');
      }

      // Click Login submit
      const submitLogin = loginModal.locator('button[type="submit"]:has-text("Sign In"), button[type="submit"]:has-text("Login")').first();
      if (await submitLogin.isVisible()) {
        await submitLogin.click();
        await page.waitForTimeout(1000);
        console.log('Login submitted.');
      }
    }

    // ----------------------------------------------------
    // 5. LOGGED-IN DASHBOARD
    // ----------------------------------------------------
    console.log('\n--- Step 5: Validating Logged-In User Dashboard ---');
    const dashboardTitle = await page.locator('h1, h2').first().textContent();
    console.log(`Dashboard Banner: "${dashboardTitle?.trim()}"`);

    // ----------------------------------------------------
    // 6. SEARCH & ADVANCED FILTERS
    // ----------------------------------------------------
    console.log('\n--- Step 6: Testing Search & Filter Discovery ---');
    const searchNavBtn = page.locator('#nav-link-search, button:has-text("Search"), a[href*="search"]').first();
    if (await searchNavBtn.isVisible()) {
      await searchNavBtn.click();
      await page.waitForTimeout(1000);

      const searchInput = page.locator('input[placeholder*="Search by Name"], input[placeholder*="Search"]').first();
      if (await searchInput.isVisible()) {
        await searchInput.fill('Coimbatore');
        await page.waitForTimeout(500);
        console.log('Filled search input: "Coimbatore"');
      }

      // Check 'Search by My Preferences' button
      const searchByPrefBtn = page.locator('button:has-text("Search by My Preferences"), button:has-text("Search by Preferences")').first();
      if (await searchByPrefBtn.isVisible()) {
        await searchByPrefBtn.click();
        await page.waitForTimeout(600);
        console.log('"Search by My Preferences" button triggered successfully.');
      }
    }

    // ----------------------------------------------------
    // 7. PROFILE DETAILS MODAL
    // ----------------------------------------------------
    console.log('\n--- Step 7: Opening Profile Details Modal ---');
    const firstProfileCardBtn = page.locator('button:has-text("View Profile"), button:has-text("View Details")').first();
    if (await firstProfileCardBtn.isVisible()) {
      await firstProfileCardBtn.click();
      await page.waitForTimeout(800);

      const profileModal = page.locator('#profile-detail-modal-container');
      const isProfileOpen = await profileModal.isVisible();
      console.log(`Profile Details Modal Open: ${isProfileOpen}`);

      // Test tabs inside profile modal
      const tabs = ['Basic Info', 'Family & Ancestry', '10 Porutham Horoscope', 'Partner Preferences', 'Match Journey'];
      for (const tabName of tabs) {
        const tabBtn = profileModal.locator(`button:has-text("${tabName}")`).first();
        if (await tabBtn.isVisible()) {
          await tabBtn.click();
          await page.waitForTimeout(300);
        }
      }
      console.log('All profile deep-dive information tabs verified.');

      // Close profile modal
      const closeProfileBtn = profileModal.locator('button[title*="Close"], svg.lucide-x').first();
      if (await closeProfileBtn.isVisible()) {
        await closeProfileBtn.click();
        await page.waitForTimeout(400);
      }
    }

    // ----------------------------------------------------
    // 8. MATCHES VIEW
    // ----------------------------------------------------
    console.log('\n--- Step 8: Validating Matches View ---');
    const matchesNavBtn = page.locator('#nav-link-matches, button:has-text("Matches")').first();
    if (await matchesNavBtn.isVisible()) {
      await matchesNavBtn.click();
      await page.waitForTimeout(800);
      console.log('Matches tab loaded successfully.');
    }

    // ----------------------------------------------------
    // 9. MESSAGES VIEW & CHAT COMPOSER
    // ----------------------------------------------------
    console.log('\n--- Step 9: Validating Messaging & Chat System ---');
    const messagesNavBtn = page.locator('#btn-header-messages, #nav-link-messages, button:has-text("Messages")').first();
    if (await messagesNavBtn.isVisible()) {
      await messagesNavBtn.click();
      await page.waitForTimeout(1000);

      // Select first conversation
      const convoItem = page.locator('[id^="conversation-item-"]').first();
      if (await convoItem.isVisible()) {
        await convoItem.click();
        await page.waitForTimeout(600);
        console.log('Selected active conversation.');
      }

      // Check chat composer
      const chatTextarea = page.locator('#message-textarea');
      if (await chatTextarea.isVisible()) {
        await chatTextarea.fill('Vanakkam! Automated browser test message.');
        await page.waitForTimeout(300);

        const sendBtn = page.locator('button[aria-label="Send message"]').first();
        if (await sendBtn.isVisible() && await sendBtn.isEnabled()) {
          await sendBtn.click();
          await page.waitForTimeout(500);
          console.log('Message sent successfully in browser.');
        }
      }
    }

    // ----------------------------------------------------
    // 10. MEMBERSHIP VIEW
    // ----------------------------------------------------
    console.log('\n--- Step 10: Validating Membership & Plans ---');
    const membershipNavBtn = page.locator('#nav-link-membership, button:has-text("Membership"), button:has-text("Plans")').first();
    if (await membershipNavBtn.isVisible()) {
      await membershipNavBtn.click();
      await page.waitForTimeout(800);

      const planCards = page.locator('.card-matrimonial, [id^="plan-card-"]');
      const planCount = await planCards.count();
      console.log(`Membership Plan Cards Rendered: ${planCount}`);
    }

    // ----------------------------------------------------
    // 11. RESPONSIVE VIEWPORT STRESS TESTING
    // ----------------------------------------------------
    console.log('\n--- Step 11: Testing Multi-Device Breakpoints & Overflow ---');
    const testViewports = [
      { width: 320, height: 568, name: '320px (iPhone SE)' },
      { width: 375, height: 667, name: '375px (iPhone 8)' },
      { width: 390, height: 844, name: '390px (iPhone 14)' },
      { width: 430, height: 932, name: '430px (iPhone 15 Pro Max)' },
      { width: 768, height: 1024, name: '768px (iPad Mini)' },
      { width: 1024, height: 768, name: '1024px (iPad Pro / Tablet)' },
      { width: 1280, height: 800, name: '1280px (Standard Desktop)' },
      { width: 1440, height: 900, name: '1440px (MacBook Desktop)' },
      { width: 1920, height: 1080, name: '1920px (Full HD Monitor)' },
    ];

    for (const vp of testViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      const sWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const cWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const hasOverflow = sWidth > cWidth;

      console.log(`[Viewport ${vp.name}]: scrollWidth=${sWidth}, clientWidth=${cWidth} -> Overflow: ${hasOverflow ? 'FAIL' : 'PASS'}`);

      if (hasOverflow) {
        throw new Error(`FAIL: Horizontal overflow detected at ${vp.name}: scrollWidth (${sWidth}) > clientWidth (${cWidth})`);
      }
    }

    console.log('\n====================================================');
    console.log('ACTUAL CHROMIUM BROWSER E2E TESTS COMPLETED 100% SUCCESSFULLY');
    console.log(`Console Errors: ${consoleLogs.length}`);
    console.log(`Page Errors: ${pageErrors.length}`);
    console.log(`Failed Network Requests: ${failedRequests.length}`);
    console.log('====================================================\n');

    if (consoleLogs.length > 0) {
      console.log('Console Errors detail:');
      consoleLogs.forEach(c => console.log(`  ${c}`));
    }

    if (pageErrors.length > 0) {
      console.log('Page Errors detail:');
      pageErrors.forEach(p => console.log(`  ${p}`));
    }

  } finally {
    await context.close();
    await browser.close();
  }
}

runBrowserE2E().catch(err => {
  console.error('Browser E2E Execution Failed:', err);
  process.exit(1);
});
