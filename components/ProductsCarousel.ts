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

    async getFirstProductWithPriceBelow(value: number) {
        return this.findFirstProductByPrice(
            (price) => price < value,
            `No product found with price below ${value}`
        );
    }

    async getFirstProductWithPriceAbove(value: number) {
        return this.findFirstProductByPrice(
            (price) => price > value,
            `No product found with price above ${value}`
        );
    }

    private async findFirstProductByPrice(predicate: (price: number) => boolean, errorMessage: string): Promise<ProductCard> {
        const productsCount = await this.productLocators.count();

        for (let i = 0; i < productsCount; i++) {
            const product = await this.product(i);
            const price = await product.getProductPrice();

            if (predicate(price)) {
                return product;
            }
        }

        throw new Error(errorMessage);
    }

}