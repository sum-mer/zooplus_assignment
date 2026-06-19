import {test} from '../fixtures/cart.fixture';

test('should show empty cart when the only product quantity is decremented to zero', async ({cartPage}) => {
    // given
    await cartPage.prepareCartWithOneProductInBasket();
    const theOnlyArticleInBasket = cartPage.yourDelivery.article(0);

    // when
    await theOnlyArticleInBasket.decrementQuantity(); // 1 -> 0

    // then
    await cartPage.emptyState.waitForVisible();
    await cartPage.emptyState.waitForMessage();
});

test('should update cart total when product quantity is decremented', async ({cartPage}) => {
    // given
    await cartPage.prepareCartWithThreeProductsInBasket();
    const firstArticleInBasket = cartPage.yourDelivery.article(0);

    // when
    await firstArticleInBasket.decrementQuantity(); // 1 -> 0

    // then
    await cartPage.yourDelivery.expectArticleCount(2);
    await cartPage.expectCartSubtotalMatchesArticles();
});
