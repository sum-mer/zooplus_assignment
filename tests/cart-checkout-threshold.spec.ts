import {test} from '../fixtures/cart.fixture';
import {CHECKOUT_THRESHOLD} from "../constants/checkout";

test('should not allow checkout when total does not exceed the threshold', async ({cartPage}) => {
    // given & when
    await cartPage.prepareCartWithOneProductBelowPrice(CHECKOUT_THRESHOLD);

    // then
    await cartPage.orderSummary.expectCheckoutDisabled();
    await cartPage.orderSummary.expectCheckoutErrorMessageVisible();
});

test('should allow checkout when total exceeds the threshold', async ({cartPage}) => {
    // given & when
    await cartPage.prepareCartWithOneProductAbovePrice(CHECKOUT_THRESHOLD);

    // then
    await cartPage.orderSummary.expectCheckoutEnabled();
});