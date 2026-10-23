// getBy locators find elements by what a user sees or a screen reader hears.
// getByRole, getByLabel, getByPlaceholder, getByText
// getByAltText, getByTitle, getByTestId need attributes this page does not have.

const {test, expect} = require('@playwright/test');

test.only('getBy locators', async ({page}) =>
{
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    // getByLabel matches a control tied to a <label for="id">.
    // Password, Gender, Student, and the checkbox are tied that way.
    // Name and Email are not: the <label> has no for, and the input has no id.
    // Date of Birth uses for="dateofBirth", but the input has no id.
    await page.getByLabel('Password').fill('secret');
    await page.getByLabel('Gender').selectOption('Female');
    await page.getByLabel('Student').check();
    await page.getByLabel(/IceCreams/).check();

    // Two inputs share name="name". The form one has no accessible name, so scope it.
    // The other sits under a heading and is reached by chaining getByRole.
    await page.locator('form input[name="name"]').fill('Devyani');
    await page.locator('form input[name="email"]').fill('devyani@example.com');
    await page.locator('form input[name="bday"]').fill('2000-01-01');
    await page.getByRole('heading', { name: 'Two-way Data Binding example:' }).getByRole('textbox').fill('Devyani');

    // getByPlaceholder matches the placeholder attribute. This is the same password box.
    await expect(page.getByPlaceholder('Password')).toHaveValue('secret');

    // getByRole matches the ARIA role and its accessible name.
    // <input type="submit"> is a button. <input type="radio"> is a radio.
    await expect(page.getByRole('radio', { name: /Entrepreneur/ })).toBeDisabled();
    await page.getByRole('button', { name: 'Submit' }).click();

    // getByText matches visible text. A string is a substring. A regex can ignore case.
    await expect(page.getByText('submitted successfully')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Shop' })).toBeVisible();

    // Nothing on this page matches these. The shape is:
    // getByAltText('logo')   -> <img alt="logo">
    // getByTitle('Close')    -> title="Close"
    // getByTestId('submit')  -> data-testid="submit"


    // await locator.filter({hasText: /text/}).getByRole('button', { name: /text/ }).click();
    // use of filter to find the element & create a powerful step
});