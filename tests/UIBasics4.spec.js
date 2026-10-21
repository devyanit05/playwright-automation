// UI elements - click, fill, press, select, hover, scroll, etc.
// Handling UI Components - dropdown, modal, popup, alert, radio button, checkbox, etc.

const {test, expect} = require('@playwright/test');

test.only('Basic UI Test9', async ({page}) =>
{
    await page.goto('https://rahulshettyacademy.com/client/#/auth/register');
    // dropdown : two types - select and non-select
    // select : dropdown with options
    // non-select : dropdown with text
    const firstName = page.locator('#firstName');
    const lastName = page.locator('#lastName');
    const email = page.locator('#userEmail');
    const mobile = page.locator('#userMobile');
    const password = page.locator('#userPassword');
    const confirmPassword = page.locator('#confirmPassword');
    const submit = page.locator('#login');
    const radiobtn = page.locator('input[formcontrolname="gender"][value="Female"]');
    const dropdown = page.locator('select.custom-select');
    const checkbox = page.locator('div.col-md-1 > input[type=checkbox]');
    const loginlink = page.locator('.login-wrapper-footer-text');
    const username = page.locator('#userEmail');
    const userpassword = page.locator('#userPassword');
    const loginbtn = page.locator('#login');

    await firstName.fill('John');
    await lastName.fill('Doe');
    await email.fill('john.doe@example.com');
    await mobile.fill('1234567890');
    await password.fill('Password123');
    await confirmPassword.fill('Password123');
    await dropdown.selectOption('3: Engineer');
    await radiobtn.click();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    // await expect(checkbox).not.toBeChecked();
    // await expect(checkbox).isChecked().toBeFalsy();
    await submit.click();
    await loginlink.click();
    await page.screenshot({path: 'screenshot9.png'});
    await username.fill('devyaninthokal@gmail.com');
    await userpassword.fill('Devu@2002');
    await loginbtn.click();
    await page.screenshot({path: 'screenshot10.png'});
    await page.pause();
    await page.close(); 
});
