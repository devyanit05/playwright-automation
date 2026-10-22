// validating attributes of the elements
// Handling child windows

// promise has 3 states: pending, fulfilled, rejected
// pending: the promise is not yet fulfilled or rejected
// fulfilled: the promise is fulfilled
// rejected: the promise is rejected

const {test, expect} = require('@playwright/test');

test.only('Basic UI Test10', async ({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://devyanit05.github.io/personal-portfolio/');

    const resume = page.locator("[href*='Resume.pdf']");

    await expect(resume).toHaveAttribute('href', /.*\.pdf/);
    // Promise.all is used to wait for all the promises to be fulfilled
    // this will return an array of the results of the promises
    // 
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        resume.click(),
      ]);
      
      expect(download.suggestedFilename()).toBe('Devyani_Thokal_Resume.pdf');
});