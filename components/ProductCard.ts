import {Locator} from '@playwright/test';
import {getPriceAsNumber} from "../helpers/priceUtils";

export class ProductCard {
    constructor(private root: Locator) {}

    get productPrice() {
        return this.root.locator('[data-zta="reducedPriceAmount"]');
    }

    async getProductPrice() {
        const priceWithCurrency = await this.productPrice
            .textContent();

        return getPriceAsNumber(priceWithCurrency);
    }

    async addToBasket() {
        await this.root
            .getByRole('button', { name: 'Add to basket' })
            .click();
    }
}