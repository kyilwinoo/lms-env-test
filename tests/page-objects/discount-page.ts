import { Page, expect } from '@playwright/test';
import { discountLocators } from '../components/Locators/discount-locators';
import { DiscountFormData, getDiscountDescription } from '../test-data/discount-criteria';
const inputText = {
    discountCreateStatus: 'Draft' as 'Draft' | 'Active',
    voucherProvider: 'LMS TESTSING', // Carro Care Apps
    category: 'Repair', // All | Grooming | Repair | Servicing | Spray
    discount_amount_percentage: '10', // // FixedAmt | Percentage
    limitAvailableQty: "3",
    discountType: "Percentage",
    discountName: "LMS Draft DISCOUNT",
}
export class createDiscounts {
    private locators: discountLocators;
    private mode: string; // "CREATE" | "EDIT" | "VIEW"
    private ipsFormData?: DiscountFormData;

    constructor(private page: Page, mode: "CREATE") {
        this.locators = new discountLocators(page);
        this.mode = mode;
    }
    setFormData(ipsFormData: DiscountFormData) {
        this.ipsFormData = ipsFormData;
    }

    async createOrEditDiscount(): Promise<void> {
        if (this.mode === "CREATE") {
            await this.createNewDiscount()
        } else if (this.mode === "EDIT") {
            // await this.locators.clickCreateNewDiscount(); //FIXME
        } else {
            throw new Error(`Unsupported mode: ${this.mode}`);
        }
    }
    async createNewDiscount(): Promise<void> {
        await this.locators.clickCreateNewDiscount();
        await this.fillOutDiscountForm();
        await this.submitDiscount(inputText.discountCreateStatus);

        // if (inputText.discountCreateStatus == 'Draft') {
        //     await this.locators.clickSaveAsDraft();
        // } else if (inputText.discountCreateStatus == 'Active') {
        //     await this.locators.clickCreateDiscount();
        // } else {
        //     throw new Error(`Unexpected discount status: ${inputText.discountCreateStatus}`);
        // }
    }
    // Function to set discount data based on description
    private setDiscountData(description: string): void {
        const discountDescription = getDiscountDescription(description);
        if (!discountDescription) {
            throw new Error(`No discount data found for description: ${description}`);
        }
        this.ipsFormData = discountDescription;
    }
    async fillOutDiscountForm(): Promise<void> {
        if (!this.ipsFormData) {
            throw new Error("Discount data is not set. Ensure that `discountCriteria` was called first.");
        }
        console.log("inputData" + this.ipsFormData.country);
        // Business Group
        await this.locators.selectBizGroup();
        if (this.ipsFormData.country == 'SG') {
            console.log("COUNTRY : " + this.ipsFormData.country);
            // Provider Name
            await this.locators.txtVoucherProviderName.waitFor({ state: 'visible' });
            await this.locators.txtVoucherProviderName.fill(this.ipsFormData.voucher_provider_name ?? '');
            // Discount Name
            await this.locators.txtDisocuntName.fill(this.ipsFormData.discount_name ?? '')
            // Voucher Title
            await this.locators.txtVoucherTitle.fill(this.ipsFormData.voucher_title ?? '')
            // Category
            await this.page.getByLabel('Category').click();
            console.log('category :' + inputText.category)
            await this.page.waitForTimeout(1000);
            await this.page.getByText(`${inputText.category}`);
            const categoryOptions = this.page.locator('.ant-select-item-option-content', { hasText: `${inputText.category}` });
            await categoryOptions.click();

            await this.page.locator('[id="__next"]').getByTitle(`${inputText.category}`).first().click();
            await this.page.getByTitle(`${inputText.category}`).nth(1).click();
            // Description
            await this.locators.txtDescription.fill(this.ipsFormData.description ?? '')
            // Terms & Conditions
            await this.locators.txtTermsAndConditions.fill(this.ipsFormData.terms_and_conditions ?? '')
            await this.locators.txtDiscountType.click();
            if (this.ipsFormData.discount_type == "FixedAmt") {
                await this.page.getByText('Fixed Amount').first().click();
                await expect(this.page.locator('form')).toContainText(`${this.ipsFormData.currencySign}`);
                await expect(this.page.getByText(`${this.ipsFormData.currencySign}`)).toBeVisible();
                await this.page.getByLabel('Amount', { exact: true }).fill(this.ipsFormData.discount_amount);
            } else {
                await this.page.getByTitle('Percentage').locator('div').click();
                await expect(this.page.getByText('%', { exact: true })).toBeVisible();
                await expect(this.page.locator('form')).toContainText('%');
                this.ipsFormData.discount_amount = inputText.discount_amount_percentage;
                await this.page.getByLabel('Amount', { exact: true }).fill(this.ipsFormData.discount_amount);
            }
            if (this.ipsFormData.minimumPurchase) {
                await this.page.getByText('Minimum purchase amount').click();
                await this.page.getByPlaceholder('Amount').click();
                await this.page.getByPlaceholder('Amount').fill(this.ipsFormData.minimum_purchase_amount ?? '');
            }
            if (this.ipsFormData.maxiDiscountUses?.isLimitAvailableQty) {
                await this.page.getByLabel('Limit available quantity').check();
                await this.locators.txtAvailableQty.fill(inputText.limitAvailableQty);
            }
            await this.page.locator('#expiry_duration_type').click();
            if (this.ipsFormData.VoucherExpiration?.expiryType == "fromIssueDate") {
                await this.page.getByText('From Issue Date').click();
                await this.page.locator('#expiry_duration').click();
                await this.page.locator('#expiry_duration').fill(inputText.limitAvailableQty);

                await this.page.locator('#expiry_duration_unit').click();
                await this.page.getByText('Months', { exact: true }).click();
            } else {
                await this.page.getByText('Fixed Date').first().click();
                await this.page.getByPlaceholder('Select date').click();
                console.log("ipsFormData.VoucherExpiration.discountExpiryOn : " + this.ipsFormData.VoucherExpiration.discountExpiryOn)
                await this.page.getByTitle(`${this.ipsFormData.VoucherExpiration.discountExpiryOn}`).locator('div').click();
            }
        }
    }
    async submitDiscount(status: 'Draft' | 'Active'): Promise<void> {
        if (status === 'Draft') {
            await this.locators.btnSaveAsDraft.waitFor({ state: 'visible' });
            await this.locators.btnSaveAsDraft.click();
        } else if (status === 'Active') {
            await this.locators.btnCreateDisocunt.waitFor({ state: 'visible' });
            await this.locators.btnCreateDisocunt.click();
        } else {
            throw new Error(`Unknown status: ${status}`);
        }
    }
    async getDiscountID(): Promise<{ getDiscountID: string; getDiscountName: string; getDiscountAction: string } | void> {
        await expect(this.page.locator('.ant-notification-notice-message')).toContainText('Discount Created!');
        const messageDesc = this.page.locator('.ant-notification-notice-description');
        console.log('messageDesc: ', messageDesc);
        await expect(messageDesc).toBeVisible();
        const messageDescText = await messageDesc.textContent();

        if (messageDescText) {
            console.log('messageDescText:', messageDescText);
            // Regex to match discount code, name, and action (created/updated)
            const match = messageDescText.match(/discount (\d+) (.+?) has been (created|updated)/i);
            if (match) {
                const getDiscountID = match[1];  // e.g., "00208"
                const getDiscountName = match[2]; // eg., LMS
                const getDiscountAction = match[3]; // e.g., "Created"
                console.log("Extracted Discount ID:", getDiscountID);
                console.log("Extracted Discount Name:", getDiscountName);
                console.log("Extracted Action:", getDiscountAction);
                return { getDiscountID, getDiscountName, getDiscountAction };
            } else {
                console.error("Failed to extract discount info from notification.");
            }
        }
    }

    async clickDiscountById(discountID: string): Promise<void> {
        await this.page.locator('[id="__next"]').getByText('Discount Name', { exact: true }).click();
        await this.page.getByText('Discount ID', { exact: true }).click();
        await this.locators.txtSearch.click();
        await this.locators.txtSearch.fill(discountID);
        await this.page.getByRole('button', { name: 'search' }).click();
        // Wait for results
        await this.page.waitForTimeout(2000);
        const tableRowLocator = this.page.locator(`td > a > span.discount-id-span.css-10iahqc`, { hasText: `ID ${discountID}` });

        const isRowVisible = await tableRowLocator.isVisible();
        if (isRowVisible) {
            // await expect(this.page.getByRole('link', { name: 'Draft' })).toBeVisible();
            // await expect(this.page.locator('tbody')).toContainText('Draft');
            // await tableRowLocator.first().click();
            await this.page.locator('td > a > span.discount-id-span.css-10iahqc', { hasText: `ID ${discountID}` }).first().click();
        } else {
            console.log(`Discount ID ${discountID} not found in the table.`);
            await expect(this.page.locator('tbody')).toContainText('No data');
        }

    }
}
