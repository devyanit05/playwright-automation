// using APIs to integrate with web automation tests to make it robust and scalable 
// APIs are used to interact with the web application and get the data from the application

const {test, expect, request} = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');

const loginPayLoad = {userEmail: "devyaninthokal@gmail.com", userPassword: "Devu@2002"};
const orderPayLoad = {
    orders: [{ country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5" }]
  };
let response;

// execute once before all the tests
test.beforeAll( async()=>
{
   const apiContext = await request.newContext();
   const apiUtils = new APIUtils(apiContext,loginPayLoad);
   response =  await apiUtils.createOrder(orderPayLoad);
 
})

// execute every time before each test
test.beforeEach(async ({page}) => 
{
});

//precondition: login is success and create order is success
//Verify if order created is showing in history page
test('API Place the order', async ({page})=>
    { 
        await page.addInitScript(value => {
     
            window.localStorage.setItem('token',value);
        }, response.token );
    await page.goto("https://rahulshettyacademy.com/client");
     await page.locator("button[routerlink*='myorders']").click();
     await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");
     
    for(let i =0; i<await rows.count(); ++i)
    {
       const rowOrderId =await rows.nth(i).locator("th").textContent();
       if (response.orderId.includes(rowOrderId))
       {
           await rows.nth(i).locator("button").first().click();
           break;
       }
    }
    const orderIdDetails =await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
     
    });
