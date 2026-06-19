import {test} from '../fixtures/cart.fixture';
import {sortDescending} from "../helpers/sortUtils";
import {CartPage} from "../pages/CartPage";
import {BrowserContext} from "@playwright/test";

test('should update cart total when one product is added to basket', async ({cartPage}) => {
    // given
    const product = await cartPage.recommendations.onEmptyBasket().product(0);

    // when
    await product.addToBasket();

    // then
    await cartPage.expectBasketWithGivenItemsCount(1);
});

test('should update cart total when multiple products are added to basket', async ({cartPage}) => {
    // given & when
    await cartPage.prepareCartWithThreeProductsInBasket();

    // then
    await cartPage.expectBasketWithGivenItemsCount(3);
});

test('should update subtotal for cheapest product when its quantity is incremented', async ({cartPage}) => {
    // given
    await cartPage.prepareCartWithThreeProductsInBasket();
    const articlesInBasket = await cartPage.yourDelivery.getArticlesWithPrices();
    const articlesSortedByPriceDesc = sortDescending(articlesInBasket);
    const cheapestProduct = articlesSortedByPriceDesc[articlesSortedByPriceDesc.length - 1].article;

    // when
    await cheapestProduct.incrementQuantity();

    // then
    const expectedQuantity = 2;
    await cheapestProduct.expectQuantity(expectedQuantity);

    const priceOfCheapestProduct = await cheapestProduct.getPrice();
    await cheapestProduct.expectArticleQuantitySubtotal(priceOfCheapestProduct * expectedQuantity);
});