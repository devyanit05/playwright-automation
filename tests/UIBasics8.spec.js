// Handle and automate frames using Playwright
// frames are used to embed content from another source into the current document

const {test, expect} = require('@playwright/test');

test.skip('handle and automate frames', async ({page}) =>
{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
    });
    await page.locator('#mouseHover').hover();
    await page.locator('#mouseHover').waitFor({state: 'visible'});
    await page.locator('#mouseHover').click();

    const framePage = page.frameLocator('#courses-iframe');
    framePage.locator('a[href*="lifetime-access"]').click();
});