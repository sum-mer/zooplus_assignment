import {expect, Locator} from '@playwright/test';
import {ProductCard} from "./ProductCard";

export class ProductsCarousel {
    constructor(private root: Locator) {}

    get productLocators() {
        return this.root.locator('[data-zta="carouselSlideWrapInner"]');
    }

    async waitForVisible() {
        await expect(this.root).toBeVisible();
    }

    async product(index: number): Promise<ProductCard> {
        return new ProductCard(this.productLocators.nth(index));
    }

}