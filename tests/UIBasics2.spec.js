// selectors are used to select the elements on the page
// css, xpath, id, class, name, tag, attribute, etc.
// locator is a class in playwright that is used to select the elements on the page

const {test, expect} = require('@playwright/test');

test('Basic UI Test7', async ({page}) =>
{
    await page.goto('https://devyanit05.github.io/personal-portfolio/');

    const projects = await page.locator('a.btn-primary').first();
    const eyebrow = await page.locator('.hero-inner .eyebrow');

    await projects.click();
    await page.waitForTimeout(1000);
    await page.screenshot({path: 'screenshot5.png'});
    const eyebrowText = await page.locator('.hero-inner .eyebrow').textContent();
    console.log(eyebrowText);
    // await expect(eyebrow).toContainText(/devops/i);
    console.log(await page.locator('div.about-copy').textContent());

    await page.goto('https://google.com');
    await page.locator('textarea.gLFyf').fill('Playwright');
    await page.locator('div.RNNXgb').press('Enter');
    await page.waitForTimeout(1000);
    await page.screenshot({path: 'screenshot6.png'});
    await page.close();
});


// how to select the elements on the page:
// 1. locator('css selector')
// 2. locator('xpath')
// 3. locator('id')
// 4. locator('class')
// 5. locator('name')
// 6. locator('tag')
// 7. locator('attribute')
// 8. locator('nth-child')
// 9. locator('nth-of-type')
// 10. locator('nth-last-child')
// 11. locator('nth-last-of-type')
// 12. locator('first')
// 13. locator('last')  
// 14. locator('only-child')
// 15. locator('only-of-type')
// 16. locator('nth-child(n)')
// 17. locator('nth-of-type(n)')
// 18. locator('nth-last-child(n)')
// 19. locator('nth-last-of-type(n)')
// 20. locator('first-child')
// 21. locator('last-child')

