import {expect, Page} from "@playwright/test";
import {add, getPriceAsNumber, getPriceWithCurrency} from "../helpers/priceUtils";
import {ShippingCountryPopup} from "./ShippingCountryPopup";

export class OrderSummary {
    constructor(private page: Page) {
    }

    get root() {
        return this.page.getByTestId('order-summary');
    }

    get subTotal() {
        return this.root.getByTestId('overview-sub-total-value');
    }

    get totalPrice() {
        return this.root.getByTestId('total-price-value');
    }

    get shippingCost() {
        return this.root.getByTestId('shipping-cost-value-overview');
    }

    get shippingCountry() {
        return this.root.getByTestId('shipping-country-name');
    }

    async getShippingCost() {
        const priceWithCurrency = await this.shippingCost
            .textContent();

        return getPriceAsNumber(priceWithCurrency);
    }

    async chooseShippingCountryInPopup(countryName: string, postalCode: string) {
        const popup = await this.openCountrySelector();
        await popup.chooseShippingCountry(countryName, postalCode);
    }

    async openCountrySelector(): Promise<ShippingCountryPopup> {
        await this.shippingCountry.click();

        const popup = new ShippingCountryPopup(this.page);
        await popup.waitForVisible();

        return popup;
    }

    async expectShippingCountry(countryName: string) {
        await expect(this.shippingCountry)
            .toHaveText(countryName);
    }

    async expectSubTotal(value: number) {
        await expect(this.subTotal)
            .toHaveText(getPriceWithCurrency(value));
    }

    async expectTotalPrice(value: number) {
        await expect(this.totalPrice)
            .toHaveText(getPriceWithCurrency(value));
    }

    async expectTotals(subtotal: number) {
        const shippingCost = await this.getShippingCost();

        await this.expectSubTotal(subtotal);
        await this.expectTotalPrice(add(subtotal, shippingCost));
    }

}