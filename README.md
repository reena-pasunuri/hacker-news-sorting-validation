# hacker-news-sorting-validation

This project is a JavaScript script built using Microsoft's [Playwright](https://playwright.dev/) framework. The script automates the process of validating that the **first 100 articles** on the Hacker News (https://news.ycombinator.com/newest) are sorted **from newest to oldest** based on their publication times.

**How It Works**
1. Launches a browser using **Playwright**.
2. Navigates to the https://news.ycombinator.com/newest.
3. Extracts the timestamps of the first 100 articles.
4. Converts timestamps to **JavaScript Date objects** for comparison.
5. Checks if the timestamps are sorted in **descending order** (newest to oldest).
6. Logs a success message if sorted correctly, otherwise reports an error.

**Setup and Installation**

1. Prerequisites
- **Node.js** should be installed on your system.
- Basic understanding of the terminal/command prompt.

2. Install Dependencies
Install **Playwright** and other required modules.

3. Run the Script
To validate the article sorting, execute the script:
node index.js

**Expected Output**
Success: If the articles are sorted correctly:
Validation successful: Articles are sorted newest to oldest.

Error: If the articles are not sorted or there's an issue:
Error: Articles are not sorted. Older article at position X, newer at position Y.


Project Files
index.js : The main script to perform sorting validation.
package.json : Project dependencies and configuration.
README.md : Instructions to run the project.

Technologies Used
Playwright: Browser automation framework.
JavaScript: Scripting language.

Why This Task?
This task demonstrates browser automation skills and validates sorting logic efficiently, showcasing practical use of automation tools.

License
This project is licensed under the MIT License.

Feedback or Contributions
Feel free to open issues or suggest improvements in the repository.

Author:
Reena Pasunuri
https://www.linkedin.com/in/reena-pasunuri-389782a0/
https://github.com/reena-pasunuri/
