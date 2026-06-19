import {Locator} from '@playwright/test';

export class ProductCard {
    constructor(private root: Locator) {}

    async addToBasket() {
        await this.root
            .getByRole('button', { name: 'Add to basket' })
            .click();
    }
}