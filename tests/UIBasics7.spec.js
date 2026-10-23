// wait and timeout strategies
// implicit wait, explicit wait, and custom wait
// implicit wait is set by the browser and is used to wait for the element to be visible or clickable
// explicit wait is set by the user and is used to wait for the element to be visible or clickable
// custom wait is set by the user and is used to wait for the element to be visible or clickable using a custom function


const {test, expect} = require('@playwright/test');

test.skip('wait and timeout strategies', async ({page}) =>
{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
});

//  Validate hidden elements
// await page.locator('input[type="checkbox"]').waitFor({state: 'visible'});
// await page.locator('input[type="checkbox"]').waitFor({state: 'hidden'});
// await page.locator('input[type="checkbox"]').toBeVisible();
// await page.locator('input[type="checkbox"]').toBeHidden();
// await page.locator('input[type="checkbox"]').waitFor({state: 'attached'});
// await page.locator('input[type="checkbox"]').waitFor({state: 'detached'});

test('Basic UI Test11', async ({page}) =>
{
    
    const slowExpect = expect.configure({timeout: 10000});
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await page.goto('https://www.myntra.com/shop/men');
    await page.goBack();
    await page.goForward();
    await page.refresh();
    await page.waitForTimeout(10000);
});