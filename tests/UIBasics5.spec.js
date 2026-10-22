// validating attributes of the elements

const {test, expect} = require('@playwright/test');

test.only('Basic UI Test10', async ({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://devyanit05.github.io/personal-portfolio/');

    const resume = page.locator("[href*='.pdf']");

    await expect(resume).toHaveAttribute('href', 'https://devyanit05.github.io/personal-portfolio/assets/resume.pdf');
});