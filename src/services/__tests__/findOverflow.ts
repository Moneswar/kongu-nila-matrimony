import { chromium } from 'playwright-core';

const CHROME_EXECUTABLE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function findOverflowElements() {
  const browser = await chromium.launch({
    executablePath: CHROME_EXECUTABLE,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const overflows = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const all = document.querySelectorAll('*');
    const results: any[] = [];

    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || rect.width > docWidth + 1) {
        results.push({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          rectRight: rect.right,
          rectWidth: rect.width,
          docWidth
        });
      }
    });
    return results;
  });

  console.log('Overflow Elements count:', overflows.length);
  overflows.slice(0, 10).forEach(o => {
    console.log(o);
  });

  await browser.close();
}

findOverflowElements().catch(console.error);
