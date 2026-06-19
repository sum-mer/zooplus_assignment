import {expect, Locator} from "@playwright/test";
import {getPriceAsNumber, getPriceWithCurrency} from "../helpers/priceUtils";

export class ArticleInBasket {
    constructor(private root: Locator) {}

    get articlePrice() {
        return this.root
            .getByTestId('article-price')
            .locator('[data-zta="reducedPriceAmount"]')
    }

    get articleQuantitySubTotal() {
        return this.root
            .getByTestId('article-quantity-subtotal');
    }

    get quantityInput() {
        return this.root
            .getByLabel('Product quantity in basket');
    }

    get incrementQuantityLocator() {
        return this.root
            .getByLabel('Increase quantity by one');
    }

    get decrementQuantityLocator() {
        return this.root
            .getByLabel('Decrease quantity by one');
    }

    async getPrice(): Promise<number> {
        const priceWithCurrency = await this.articlePrice
            .textContent();

        return getPriceAsNumber(priceWithCurrency);
    }

    async getArticleQuantitySubtotal(): Promise<number> {
        const priceWithCurrency = await this.articleQuantitySubTotal
            .textContent();

        return getPriceAsNumber(priceWithCurrency);
    }

    async incrementQuantity() {
        await this.incrementQuantityLocator
            .click();
    }

    async decrementQuantity() {
        await this.decrementQuantityLocator
            .click();
    }

    async expectQuantity(value: number) {
        await expect(this.quantityInput)
            .toHaveValue(String(value));
    }

    async expectArticleQuantitySubtotal(value: number) {
        await expect(this.articleQuantitySubTotal)
            .toHaveText(getPriceWithCurrency(value));
    }
}