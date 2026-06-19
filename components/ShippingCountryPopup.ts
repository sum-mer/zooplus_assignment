import {expect, Page} from "@playwright/test";

export class ShippingCountryPopup {
    constructor(private page: Page) {
    }

    get root() {
        return this.page.getByTestId('bpa-popover-template');
    }

    get dropdownShippingCountriesTriggerButton() {
        return this.root.locator('[data-zta="dropdownMenuTriggerButton"]');
    }

    get dropdownShippingCountriesList() {
        return this.root.getByTestId('shipping-cost-dropdown');
    }

    get postalCodeInput() {
        return this.root.locator('input[placeholder="Postcode"]');
    }

    get updateShippingCountryButton() {
        return this.root.getByTestId('shipping-cost-popover-action');
    }

    async waitForVisible() {
        await expect(this.root).toBeVisible();
    }

    async chooseShippingCountry(countryName: string, postalCode: string) {
        await this.openShippingCountriesDropdownList();
        await this.chooseShippingCountryFromDropDown(countryName, postalCode);
        await this.fillInPostalCode(postalCode);
        await this.updateShippingCountryButton.click();
        await expect(this.dropdownShippingCountriesList).toBeHidden();
    }

    private async openShippingCountriesDropdownList() {
        await this.dropdownShippingCountriesTriggerButton.click();
        await expect(this.dropdownShippingCountriesList).toBeVisible();
    }

    private async chooseShippingCountryFromDropDown(countryName: string, postalCode: string) {
        const countryItem = this.dropdownShippingCountriesList.locator(`li[data-label="${countryName}"]`);
        await countryItem.click();
    }

    private async fillInPostalCode(postalCode: string) {
        await this.postalCodeInput.fill(postalCode);
    }

}