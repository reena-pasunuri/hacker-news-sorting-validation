const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });  // Change to false to see browser
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Hacker News 'newest' page
    await page.goto('https://news.ycombinator.com/newest', { waitUntil: 'networkidle' });
    await page.waitForSelector('tr.athing');  // Wait for articles to load

    let articles = [];

    // Collect exactly 100 articles, handling pagination
    while (articles.length < 100) {
        const newArticles = await page.locator('tr.athing').elementHandles();
        articles.push(...newArticles);
        console.log(`Currently found ${articles.length} articles`);

        if (articles.length >= 100) break; // Stop if 100 articles are collected

        // Find and click the "More" button if available
        const moreButton = await page.locator('a.morelink');
        if (await moreButton.count() === 0) break;  // No more pages to load

        await moreButton.click();
        await page.waitForTimeout(3000);  // Wait for the next page to load
    }

    // Keep only the first 100 articles
    articles = articles.slice(0, 100);

    if (articles.length !== 100) {
        console.error(`❌ Error: Found ${articles.length} articles (expected exactly 100)`);
        await browser.close();
        process.exit(1);
    } else {
        console.log(`✅ Success: Found exactly ${articles.length} articles`);
    }

    // Extract timestamps for sorting validation
    const timestamps = [];
    for (const article of articles) {
        try {
            const freshArticle = await page.locator('tr.athing').nth(articles.indexOf(article));

            // Wait for the timestamp to appear (with a timeout of 10 seconds)
            await freshArticle.waitForSelector('span.age', { timeout: 10000 });

            // Extract timestamp
            const timeElement = await freshArticle.locator('span.age').getAttribute('title');

            if (!timeElement) {
                console.warn(`⚠️ Warning: Unable to extract time for an article, skipping...`);
                continue;
            }

            console.log(`Extracted time: ${timeElement}`);
            timestamps.push(new Date(timeElement).getTime());

        } catch (error) {
            console.warn(`⚠️ Warning: Timeout while extracting timestamp, skipping this article...`);
            continue;
        }
    }

    // Validate sorting order (newest to oldest)
    for (let i = 1; i < timestamps.length; i++) {
        if (timestamps[i - 1] < timestamps[i]) {
            console.error(`❌ Sorting error: Older article found before newer one at index ${i}`);
            await browser.close();
            process.exit(1);
        }
    }

    console.log('✅ Validation successful: Exactly 100 articles are sorted from newest to oldest.');

    await browser.close();
})();
