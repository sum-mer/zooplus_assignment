import {test} from '../fixtures/cart.fixture';
import {CartPage} from "../pages/CartPage";
import {BrowserContext, expect} from "@playwright/test";

async function printAndCheck(ctx: BrowserContext, exp: string) {
    const cookies = await ctx.cookies();
    const sidVal = cookies.find(c => c.name === 'sid');
    console.log(sidVal.value);
    expect(sidVal.value).toEqual(exp);
}

/**
 * Add products to cart and replace the browser cookie named 'sid' with the value composed of your name, surname and word
 * 'test', using pattern 'name-surname-test'. Perform cart operation with the updated sid value. In a fresh session set the sid to your
 * custom one and refresh the page. Verify cart has elements from your 1 st session.
 */
test.skip('cookie sid replacement', async ({cartPage, context, browser}) => {
    // SESSION 1
    await cartPage.prepareCartWithOneProductInBasket(); // Add products to cart
    const articleInBasket = cartPage.yourDelivery.article(0); // quantity == 1 before changing cookie

    const customSID = "olga-zk-test";

    await context.addCookies([{
        name: 'sid',
        value: customSID, // replace the browser cookie named 'sid' with the value ...
        domain: '.zooplus.com',
        path: '/'
    }]);

    await printAndCheck(context, customSID); // correct == custom sid in context

    // Perform cart operation with the updated sid value.
    await articleInBasket.incrementQuantity(); // BUT looking at Network tab - in requests previous sid value (uuid) is sent...
    await articleInBasket.expectQuantity(2);

    // SESSION 2
    const newContext = await browser.newContext(); // In a fresh session

    await newContext.addCookies([{ // set the sid to your custom one
        name: 'sid',
        value: customSID,
        domain: '.zooplus.com',
        path: '/'
    }]);
    await printAndCheck(newContext, customSID);
    const newPage = await newContext.newPage();

    const newCartPage = new CartPage(newPage);
    await newCartPage.goto(); // and refresh the page

    await newCartPage.filledState.waitForVisible();
});