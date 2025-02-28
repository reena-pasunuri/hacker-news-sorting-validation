const { chromium } = require('playwright');

describe('Hacker News Sorting Validation', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://news.ycombinator.com/newest', { waitUntil: 'networkidle' });
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    test('At least 100 articles are present', async () => {
        await page.waitForSelector('tr.athing.submission');  //Ensures articles are loaded
        const articles = await page.locator('tr.athing.submission').elementHandles();
        console.log(`Found ${articles.length} articles`);
        expect(articles.length).toBeGreaterThanOrEqual(100);
    });

    test('Articles are sorted from newest to oldest', async () => {
        const articles = await page.locator('tr.athing.submission').elementHandles();

        const timestamps = [];
        for (const article of articles.slice(0, 100)) {
            const timeElement = await article.evaluateHandle(el => el.querySelector('span.age'));
            if (!timeElement) continue;
            const timeText = await timeElement.evaluate(el => el.getAttribute('title'));
            timestamps.push(new Date(timeText).getTime());
        }

        for (let i = 1; i < timestamps.length; i++) {
            expect(timestamps[i - 1]).toBeGreaterThanOrEqual(timestamps[i]);
        }
    });
});
