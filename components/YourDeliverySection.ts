import {expect, Page} from "@playwright/test";
import {ArticleInBasket} from "./ArticleInBasket";
import {ArticleData} from "../types/ArticleData";

export class YourDeliverySection {
    constructor(private page: Page) {
    }

    get root() {
        return this.page.getByLabel('Your delivery');
    }

    get articleLocators() {
        return this.root.getByTestId('standard-article');
    }

    async waitForVisible() {
        await expect(this.root).toBeVisible();
    }

    article(index: number): ArticleInBasket {
        return new ArticleInBasket(
            this.articleLocators.nth(index)
        );
    }

    async getArticles(): Promise<ArticleInBasket[]> {
        const count = await this.articleLocators.count();

        return Array.from({ length: count }, (_, i) =>
            new ArticleInBasket(this.articleLocators.nth(i))
        );
    }

    async getArticlesWithPrices(): Promise<ArticleData[]> {
        const articles = await this.getArticles();

        return Promise.all(
            articles.map(async (article) => ({
                article,
                price: await article.getPrice(),
            }))
        );
    }

    async expectArticleCount(count: number) {
        await expect(this.articleLocators).toHaveCount(count);
    }

    async expectArticleConsistency(index: number) {
        const article = this.article(index);

        const articlePrice = await article.getPrice();
        const articleSubtotal = await article.getArticleQuantitySubtotal();

        expect(articlePrice).toEqual(articleSubtotal);
    }

}