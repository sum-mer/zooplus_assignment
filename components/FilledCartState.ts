import {expect, Page} from "@playwright/test";

export class FilledCartState {
    constructor(private page: Page) {}

    get root() {
        return this.page.getByTestId('web_cart');
    }

    async waitForVisible() {
        await expect(this.root).toBeVisible();
    }

}