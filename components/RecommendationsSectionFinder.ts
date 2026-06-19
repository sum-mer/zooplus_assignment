import {Page} from "@playwright/test";
import {ProductsCarousel} from "./ProductsCarousel";

export class RecommendationsSectionFinder {
    constructor(private page: Page) {}

    byTitle(title: string): ProductsCarousel {
        const root = this.page
            .locator('h2', { hasText: title })
            .locator('xpath=following-sibling::div[1]');

        return new ProductsCarousel(root);
    }

    onEmptyBasket(): ProductsCarousel {
        return this.byTitle('Recommendations');
    }

    onFilledBasket(): ProductsCarousel {
        return this.byTitle('Other recommended products');
    }
}