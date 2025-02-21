const { chromium } = require("playwright");

async function validateSortingHackerNews() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  let articles = [];
  let nextPageUrl = "https://news.ycombinator.com/newest";

  // Function to convert relative times to timestamps
  function parseRelativeTime(relativeTime) {
    const now = new Date();
    const match = relativeTime.match(/(\d+)\s*(minute|hour|day|week|month)s?\s*ago/);

    if (!match) return now.getTime(); // Default to now if no match

    const value = parseInt(match[1], 10);
    const unit = match[2];

    let timeAgo = new Date(now);
    switch (unit) {
      case "minute":
        timeAgo.setMinutes(now.getMinutes() - value);
        break;
      case "hour":
        timeAgo.setHours(now.getHours() - value);
        break;
      case "day":
        timeAgo.setDate(now.getDate() - value);
        break;
      case "week":
        timeAgo.setDate(now.getDate() - value * 7);
        break;
      case "month":
        timeAgo.setMonth(now.getMonth() - value);
        break;
    }
    return timeAgo.getTime();
  }

  // Loop until we collect at least 100 articles
  while (articles.length < 100) {
    await page.goto(nextPageUrl);

    const pageArticles = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll(".athing"));
      return rows.map(row => {
        const titleElement = row.querySelector(".titleline > a");
        const ageElement = row.nextElementSibling?.querySelector(".age > a");

        return {
          title: titleElement?.innerText.trim() || "No title",
          link: titleElement?.href || "No link",
          time: ageElement?.innerText.trim() || "Unknown time"
        };
      });
    });

    articles = articles.concat(pageArticles);

    // Get next page link
    const nextLink = await page.evaluate(() => {
      const nextButton = document.querySelector("a.morelink");
      return nextButton ? nextButton.href : null;
    });

    if (!nextLink) break; // Stop if no more pages
    nextPageUrl = nextLink;
  }

  // Keep only the first 100 articles
  articles = articles.slice(0, 100);

  // Convert times to timestamps
  const parsedArticles = articles.map(article => ({
    ...article,
    timestamp: parseRelativeTime(article.time)
  }));

  // Validate sorting: Check if timestamps are in descending order
  let isSorted = true;
  for (let i = 0; i < parsedArticles.length - 1; i++) {
    if (parsedArticles[i].timestamp < parsedArticles[i + 1].timestamp) {
      isSorted = false;
      break;
    }
  }

  // Output validation result
  if (isSorted) {
    console.log("✅ The first 100 articles are correctly sorted from newest to oldest.");
  } else {
    console.log("❌ The first 100 articles are NOT sorted correctly.");
  }

  // Print timestamps for debugging
  // console.log(parsedArticles.map(a => ({ title: a.title, time: a.time, timestamp: a.timestamp })));

  await browser.close();
}

(async () => {
  await validateSortingHackerNews();
})();
