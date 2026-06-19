import {expect, Page} from '@playwright/test';
import {EmptyCartState} from "../components/EmptyCartState";
import {FilledCartState} from "../components/FilledCartState";
import {YourDeliverySection} from "../components/YourDeliverySection";
import {OrderSummary} from "../components/OrderSummary";
import {RecommendationsSectionFinder} from "../components/RecommendationsSectionFinder";
import {add} from "../helpers/priceUtils";

export class CartPage {

    readonly emptyState: EmptyCartState;
    readonly filledState: FilledCartState;

    readonly yourDelivery: YourDeliverySection;
    readonly orderSummary: OrderSummary;
    readonly recommendations: RecommendationsSectionFinder;

    constructor(private readonly page: Page) {
        this.emptyState = new EmptyCartState(page);
        this.filledState = new FilledCartState(page);

        this.yourDelivery = new YourDeliverySection(page);
        this.orderSummary = new OrderSummary(page);

        this.recommendations = new RecommendationsSectionFinder(page);
    }

    async goto() {
        await this.page.goto('/checkout/cart');
    }

    async openEmptyCartForGuestUser() {
        await this.goto();

        await this.handleCookies();

        await this.emptyState.waitForVisible();
        await this.recommendations.onEmptyBasket().waitForVisible();
    }

    async handleCookies() {
        const oneTrustBanner = this.page.locator('#onetrust-banner-sdk');
        await expect(oneTrustBanner).toBeVisible();

        const consentButton = this.page.getByRole('button', {name: 'Agree and continue'});
        await expect(consentButton).toBeVisible();
        await consentButton.click();
        await expect(consentButton).toBeHidden();
    }

    async prepareCartWithOneProductInBasket() {
        const productA = await this.recommendations.onEmptyBasket().product(0);
        await productA.addToBasket();

        await this.filledState.waitForVisible();
        await this.yourDelivery.waitForVisible();
        await this.yourDelivery.expectArticleCount(1);
    }

    async prepareCartWithOneProductAbovePrice(value: number) {
        const productA = await this.recommendations.onEmptyBasket().getFirstProductWithPriceAbove(value);
        await productA.addToBasket();

        await this.filledState.waitForVisible();
        await this.yourDelivery.waitForVisible();
        await this.yourDelivery.expectArticleCount(1);
    }


    async prepareCartWithOneProductBelowPrice(value: number) {
        const productA = await this.recommendations.onEmptyBasket().getFirstProductWithPriceBelow(value);
        await productA.addToBasket();

        await this.filledState.waitForVisible();
        await this.yourDelivery.waitForVisible();
        await this.yourDelivery.expectArticleCount(1);
    }

    async prepareCartWithThreeProductsInBasket() {
        await this.prepareCartWithOneProductInBasket();

        const productB = await this.recommendations.onFilledBasket().product(1);
        await productB.addToBasket();
        await this.yourDelivery.expectArticleCount(2);

        const productC = await this.recommendations.onFilledBasket().product(2);
        await productC.addToBasket();
        await this.yourDelivery.expectArticleCount(3);
    }

    async expectBasketWithGivenItemsCount(productCount: number) {
        await this.filledState.waitForVisible();
        await this.yourDelivery.waitForVisible();

        await this.yourDelivery.expectArticleCount(productCount);
        for (let i = 0; i < productCount; i++) {
            await this.yourDelivery.expectArticleConsistency(i);
        }

        const articlesSubtotal = await this.expectCartSubtotalMatchesArticles();
        await this.orderSummary.expectTotals(articlesSubtotal);
    }

    async expectCartSubtotalMatchesArticles() {
        const articlesInBasket = this.yourDelivery.articleLocators;
        const articlesCount = await articlesInBasket.count();

        let sum = 0;
        for (let i = 0; i < articlesCount; i++) {
            sum = add(sum, await this.yourDelivery.article(i).getPrice());
        }

        await this.orderSummary.expectSubTotal(sum);

        return sum;
    }

}