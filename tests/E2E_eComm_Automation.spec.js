// E2E e-commerce flow automation to place an order on the website https://rahulshettyacademy.com/client/#/auth/login

const {test, expect} = require('@playwright/test');

test.only('order placement', async ({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    const username = page.locator('#userEmail');
    const userpassword = page.locator('#userPassword');
    const loginbtn = page.locator('#login');
    const products = page.locator('.card-body');
    const titles = page.locator('.card-body b');
    const desiredProduct = 'iphone 13 pro';

    await username.fill('devyaninthokal@gmail.com');
    await userpassword.fill('Devu@2002');
    await loginbtn.click();
    await products.first().waitFor();
    const products_count = await products.count();

    console.log(products_count);
    console.log(await titles.allTextContents());

    for(let i = 0; i < products_count; i++)
    {
        const title = await titles.nth(i).textContent();
        console.log(title);
        if(title.includes(desiredProduct))
        {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    const cartBtn = page.locator("button[routerlink*='cart']");
    await cartBtn.click();
    await page.screenshot({path: 'cart_after_adding_product.png'});

    const checkoutBtn = page.locator('li.totalRow .btn');
    await checkoutBtn.click();
    await page.screenshot({path: 'checkout_after_clicking_checkout.png'});

    const field = title => page.locator('.field').filter({ hasText: title });
    const cardNumber = field('Credit Card Number').locator('input');
    const cardExpMonth = field('Expiry Date').locator('select').nth(0);
    const cardExpDay = field('Expiry Date').locator('select').nth(1);
    const cardCvv = field('CVV Code').locator('input');
    const cardHolderName = field('Name on Card').locator('input');
    const applyCoupon = page.locator("input[name='coupon']");
    const applyCouponBtn = page.getByRole('button', { name: 'Apply Coupon' });
    const userMail = page.locator('.user__name > input');
    const userCountry = page.locator("input[placeholder='Select Country']");
    const countryOptions = page.locator('.ta-results button');
    const placeOrderBtn = page.locator('.action__submit');

    console.log(await cardNumber.inputValue());
    await cardNumber.fill('4542 9931 9292 2293');
    await cardExpMonth.selectOption('12');
    await cardExpDay.selectOption('26');
    await cardCvv.fill('123');
    await cardHolderName.fill('Devyani Thokal');
    await applyCoupon.fill('rahulshettyacademy');
    await applyCouponBtn.click();
    await expect(page.getByText('* Coupon Applied')).toBeVisible();
    await expect(userMail).toHaveValue('devyaninthokal@gmail.com');

    await userCountry.pressSequentially('Ind');
    await countryOptions.filter({ hasText: /^\s*India$/ }).click();
    await expect(userCountry).toHaveValue('India');

    await placeOrderBtn.click();
    await expect(page.locator('.hero-primary')).toHaveText(/thankyou for the order/i);
    await page.screenshot({path: 'order_placed_successfully.png'});

    await page.getByRole('button', { name: /Download/ }).click();
    await page.pause();
});