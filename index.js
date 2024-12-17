// Import Playwright
const { chromium } = require('playwright');

(async () => {
  // Launch a browser instance
  const browser = await chromium.launch({ headless: true }); // Set headless to false for debugging
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Hacker News 'newest' page
  await page.goto('https://news.ycombinator.com/newest');

  // Selectors for the article elements
  const articleSelector = 'tr.athing';
  const timeSelector = 'span.age';

  // Extract the articles, limiting to 100
  const articles = await page.locator(articleSelector).elementHandles();

  if (articles.length < 100) {
    console.error(`Error: Less than 100 articles found. Found: ${articles.length}`);
    await browser.close();
    process.exit(1);
  }

  // Extract publication times for the first 100 articles
  const timestamps = [];
  for (let i = 0; i < 100; i++) {
    const timeElement = await articles[i].$(timeSelector);
    if (!timeElement) {
      console.error(`Error: Unable to extract time for article at position ${i}`);
      await browser.close();
      process.exit(1);
    }

    const timeText = await timeElement.getAttribute('title');
    if (!timeText) {
      console.error(`Error: Time attribute missing for article at position ${i}`);
      await browser.close();
      process.exit(1);
    }

    // Parse the publication time into a Date object
    const publicationTime = new Date(timeText);
    if (isNaN(publicationTime.getTime())) {
      console.error(`Error: Invalid date extracted: ${timeText}`);
      await browser.close();
      process.exit(1);
    }

    timestamps.push(publicationTime);
  }

  // Validate that the articles are sorted newest to oldest
  for (let i = 1; i < timestamps.length; i++) {
    if (timestamps[i - 1] < timestamps[i]) {
      console.error(`Error: Articles are not sorted. Older article at position ${i - 1}, newer at position ${i}`);
      await browser.close();
      process.exit(1);
    }
  }

  console.log('Validation successful: Articles are sorted newest to oldest.');

  // Close the browser
  await browser.close();
})();