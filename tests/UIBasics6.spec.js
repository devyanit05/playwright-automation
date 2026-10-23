// GetBy locators for smart testing using Playwright
// getByRole, getByLabel, getByPlaceholder, getByText, getByTestId
// getByText, getByAltText, getByTitle, getByTestId

const {test, expect} = require('@playwright/test');

test.only('getBy locators', async ({page}) =>
{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
});