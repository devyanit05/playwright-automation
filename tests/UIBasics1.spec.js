const {test, expect} = require('@playwright/test');

// test annotation is used to annotate the test case
// example: test.describe, test.it, test.beforeEach, test.afterEach, test.beforeAll, test.afterAll

// test takes 2 parameters:1. test name, 2. test function
test('Basic UI Test1', async function()
{
    // async await is used to wait for the promise to resolve

});

// anonymous function in JS - arrow function
test('Basic UI Test2', async () =>
{
    
});

// global fixtures : are used to set up the test environment - global fixtures are defined in the test.config.js file
// example: browser, page, context, etc.

test('Basic UI Test3', async ({browser}) =>
    {
        // browser - plugins , cookies , etc.
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://www.google.com');
        await page.waitForTimeout(1000);
        await page.screenshot({path: 'screenshot.png'});
        await page.close();
        await context.close();
    });

// local fixtures : are used to set up the test environment - local fixtures are defined in the test file
test('Basic UI Test4', async ({page}) =>
{
    await page.goto('https://devyanit05.github.io/personal-portfolio/');
    await page.waitForTimeout(1000);
    await page.screenshot({path: 'screenshot2.png'});
    await page.close();
});

// test.only : is used to run only the test case with the test.only annotation
test('Basic UI Test5', async ({page}) =>
{
    await page.goto('https://devyanit05.github.io/personal-portfolio/');
    await page.waitForTimeout(1000);
    await page.screenshot({path: 'screenshot3.png'});
    await page.close();
});

// test.skip : is used to skip the test case with the test.skip annotation
test.skip('Basic UI Test6', async ({page}) =>
{
    await page.goto('https://devyanit05.github.io/personal-portfolio/');
    await page.waitForTimeout(1000);
    console.log(await page.title());
    await expect(page).toHaveTitle('Devyani Thokal — Software Engineer · DevOps');
    await page.close();
});
    