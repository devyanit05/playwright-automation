// UI elements - click, fill, press, select, hover, scroll, etc.
// Handling UI Components - dropdown, modal, popup, alert, radio button, checkbox, etc.

const {test, expect} = require('@playwright/test');

test('Basic UI Test9', async ({page}) =>
{
    await page.goto('https://www.myntra.com/shop/men');
    await page.close();
});
