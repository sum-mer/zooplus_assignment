import {test} from '../fixtures/cart.fixture';

test('should show selected country in cart order summary when postal code is not provided', async ({cartPage}) => {
    // given
    await cartPage.prepareCartWithOneProductInBasket();
    const countryName = 'Poland';
    const postalCode = '';

    // when
    await cartPage.orderSummary.chooseShippingCountryInPopup(countryName, postalCode);

    // then
    await cartPage.orderSummary.expectShippingCountry(countryName);
});


test('should show selected country and postal code in cart order summary when both provided', async ({cartPage}) => {
    // given
    await cartPage.prepareCartWithOneProductInBasket();
    const countryName = 'Spain';
    const postalCode = '11-123';

    // when
    await cartPage.orderSummary.chooseShippingCountryInPopup(countryName, postalCode);

    // then
    await cartPage.orderSummary.expectShippingCountry(`${countryName} (${postalCode})`);
});