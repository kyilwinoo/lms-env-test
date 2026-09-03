import { expect, type Locator, type Page } from "@playwright/test";

export class discountLocators {
    readonly page: Page
    readonly countryInfo: Locator | undefined
    readonly modalInner: Locator | undefined
    readonly modalDialog: Locator | undefined
    readonly pageTitle: RegExp | undefined
    readonly confrimText: string | undefined
    readonly successAssignText: string | undefined
    readonly currentDateFmrt: string | undefined
    readonly btnCreateNewDiscount: Locator
    readonly btnSaveAsDraft: Locator
    readonly btnCreateDisocunt: Locator
    readonly txtSearchBy: Locator
    readonly txtSearch: Locator
    readonly btnSearch: Locator
    readonly txtBusinessGroup: Locator
    readonly txtVoucherProviderName: Locator
    readonly txtDisocuntName: Locator
    readonly txtVoucherTitle: Locator
    readonly txtCategory: Locator | undefined
    readonly txtDescription: Locator
    readonly txtTermsAndConditions: Locator
    readonly txtDiscountType: Locator
    readonly txtDiscountAmount: Locator | undefined
    readonly txtDiscountID!: Locator;
    readonly txtDiscountStatus: Locator | undefined
    readonly txtAvailableQty: Locator

    // Define constants for static text
    static readonly SELECT_BUSINESS_GROUP_TEXT = 'Carro Care [SG]';
    static readonly SEARCH_BY = 'Discount ID';


    constructor(page: Page) {
        this.page = page
        this.btnCreateNewDiscount = page.locator('//html/body/div/main/div/div[3]/div/div[1]/header/a/button');
        //page.getByRole('button', { name: 'Create New Discount' });
        this.btnSaveAsDraft = page.locator('//html/body/div[1]/main/div/div[2]/div/form/div[1]/footer/button[1]');
        this.btnCreateDisocunt = page.locator('//html/body/div[1]/main/div/div[2]/div/form/div[1]/footer/button[2]');
        this.txtBusinessGroup = page.locator('#group_id');
        this.txtVoucherProviderName = page.locator('#voucher_provider_name');
        this.txtDisocuntName = page.locator('#name');
        this.txtVoucherTitle = page.locator('#title');
        this.txtDescription = page.locator('#description');
        this.txtTermsAndConditions = page.locator('#terms_and_conditions');
        this.txtDiscountType = page.locator('#discount_type');
        this.txtAvailableQty = page.locator('#max_available_quantity');
        this.txtSearchBy = page.locator('[id="__next"]').first();
        this.txtSearch = page.locator('[id="search_query"]')
        this.btnSearch = page.locator('//html/body/div/main/div/div[3]/div/div[1]/div/form/div[2]/div/div/div/div/span/span/span[2]/button');
    }
    // async assertPageTitle() {
    //     await expect(this.page).toHaveTitle(this.pageTitle)
    // }
    async clickCreateNewDiscount() {
        await this.btnCreateNewDiscount.waitFor();
        await this.btnCreateNewDiscount.click();
    }
    async clickEditDiscount() {
        await this.page.getByRole('button', { name: 'Edit' }).waitFor();
        await this.page.getByRole('button', { name: 'Edit' }).click();
    }
    async selectBizGroup() {
        await this.txtBusinessGroup.waitFor();
        await this.txtBusinessGroup.click();
        await this.page.getByTitle(`${discountLocators.SELECT_BUSINESS_GROUP_TEXT}`).waitFor();
        await this.page.getByTitle(`${discountLocators.SELECT_BUSINESS_GROUP_TEXT}`).click();
    }


    async clickSaveAsDraft() {
        await expect(this.btnSaveAsDraft).toBeEnabled()
        this.btnSaveAsDraft.click();
    }
    async clickCreateDiscount() {
        await expect(this.btnCreateDisocunt).toBeEnabled()
        this.btnCreateDisocunt.click();
    }
    async getCountryInfo(): Promise<string | null> {
        if (this.countryInfo) {
            await this.countryInfo.waitFor();
        } else {
            throw new Error("countryInfo is undefined");
        }
        return await this.page.locator('span').filter({ hasText: 'Singapore' }).innerText()
    }
    async switchCountry(to: string): Promise<void> {
        const getCurrentCountryInfo = await this.getCountryInfo()
        console.log("selected country: " + getCurrentCountryInfo)
        console.log("Current Contry Info: ", getCurrentCountryInfo)
        if (!getCurrentCountryInfo?.includes(to)) {
            if (this.countryInfo) {
                await this.countryInfo.waitFor();
            } else {
                throw new Error("countryInfo is undefined");
            }
            await this.countryInfo.click()
            await this.page.getByTestId('country-switch-' + to).click()
            await this.page.waitForLoadState('networkidle')
            await this.page.waitForTimeout(1000)
        }
    }
}