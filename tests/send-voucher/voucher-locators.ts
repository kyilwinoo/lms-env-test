import { expect, type Locator, type Page } from "@playwright/test";

export class voucherLocators {
    readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
    async assertPageTitle() {
        const pageTitle = await this.page.locator('h1');
        await expect(pageTitle).toHaveText('Vouchers');
    }

}