# Validate-Sorting-of-Hacker-News-
This script uses Playwright to automate the process of validating whether the newest articles on Hacker News are correctly sorted from newest to oldest based on their timestamps.


## Features
- Scrapes the first 100 articles from the Hacker News "Newest" page.
- Extracts the title, link, and relative time of each article.
- Converts relative timestamps (e.g., "5 minutes ago") into absolute timestamps.
- Validates whether the articles are sorted correctly in descending order of their timestamps.
- Outputs a success or failure message based on the sorting validation.

## Prerequisites
Ensure you have the following installed before running the script:
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [Playwright](https://playwright.dev/) for browser automation

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/your-username/validate-hn-sorting.git
   cd validate-hn-sorting
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage
Run the script using Node.js:
```sh
node validateSortingHackerNews.js
```

The script will launch a Chromium browser, navigate to the Hacker News "Newest" page, and scrape articles until it collects at least 100. It will then check if they are sorted from newest to oldest and print the result.

## Expected Output
- If the articles are correctly sorted:
  ```sh
  ✅ The first 100 articles are correctly sorted from newest to oldest.
  ```
- If the sorting is incorrect:
  ```sh
  ❌ The first 100 articles are NOT sorted correctly.
  ```

## How It Works
1. Opens a new Chromium browser instance.
2. Iterates through Hacker News pages, scraping article titles, links, and relative timestamps.
3. Converts relative timestamps (e.g., "10 minutes ago") to absolute timestamps.
4. Validates whether the articles are sorted in descending order.
5. Outputs the validation result.
6. Closes the browser.

## Notes
- The script runs in non-headless mode (with a visible browser window) for debugging.
- The `parseRelativeTime` function converts relative timestamps to absolute timestamps.
- It stops scraping when it collects 100 articles or when there are no more pages.


