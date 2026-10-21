const {test, expect} = require('@playwright/test');
// Locators:
// xpath
// css selector
// attribute
// nth child

// how to wait for the element to be visible - waitForLoadState('networkidle'), waitForNetworkIdle

test('Basic UI Test8', async ({page}) =>
{
    // wait for the element to be visible - waitFor
    await page.goto('https://www.myntra.com/shop/men');
    const navBar = page.locator('div.desktop-navContent');
    const navBarItems = navBar.locator('div.desktop-navLink > a');
    await navBarItems.first().waitFor();
    console.log(await navBarItems.allTextContents());

    // xpath locator
    await navBarItems.first().waitFor();
    const xpathLocator = page.locator('//div[@class="desktop-navLink"]//div[@class="desktop-navContent"]//a');
    console.log(await xpathLocator.allTextContents());

    // css selector locator
    await navBarItems.first().waitFor();
    const cssSelectorLocator = page.locator('div.desktop-navLink div.desktop-navContent a');
    console.log(await cssSelectorLocator.allTextContents());

    // attribute locator
    await navBarItems.first().waitFor();
    const attributeLocator = page.locator('div.desktop-navLink div.desktop-navContent a[href]');
    console.log(await attributeLocator.allTextContents());

    // nth child locator
    await navBarItems.first().waitFor();
    const nthChildLocator = page.locator('div.desktop-navLink div.desktop-navContent a:nth-child(1)');
    console.log(await nthChildLocator.allTextContents());

    await page.close();
});
