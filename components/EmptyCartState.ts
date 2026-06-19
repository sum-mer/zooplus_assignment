import {expect, Page} from "@playwright/test";

export class EmptyCartState {

    constructor(private page: Page) {}

    get root() {
        return this.page.getByTestId('checkout-empty-cart');
    }

    get removedArticleMessageLocator() {
        return this.page.getByTestId('removed-article-msg');
    }

    async waitForVisible() {
        await expect(this.root).toBeVisible();
    }

    async waitForMessage() {
        await expect(this.removedArticleMessageLocator).toBeVisible();
    }
}