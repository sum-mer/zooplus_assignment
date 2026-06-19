**Requirements:**
- node.js
- npm

**Running tests:**

`npm install`

`npx playwright install`

`npx playwright test`

**Disclaimer:**

Since search and navigation flows are explicitly out of scope, all products used in the tests are added through the Cart Recommendations section.

In a real-world test environment, test data setup (such as adding products to the cart) I would typically done via API calls rather than UI interactions to improve tests performance
and to reduce flakiness.

However, in this exercise, the cart is being filled through UI steps to strictly follow the requirements and validate the full user journey.