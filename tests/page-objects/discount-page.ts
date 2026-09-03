import { Locator, Page, expect } from '@playwright/test';
import { discountLocators } from '../discounts/discount-locators';
import { discountCriteriaMap, DiscountFormData } from '../test-data/discount-criteria';
import { DiscountDetails } from '../page-objects/discount-details';

const inputText = {
    discountCreateStatus: 'Draft' as 'Active' | 'Draft',
    voucherProvider: 'LMS TESTING', // Carro Care Apps
    category: 'Spray', // All | Grooming | Repair | Servicing | Spray
    discount_amount_percentage: '10', // // FixedAmt | Percentage
    limitAvailableQty: "3",
    discountType: "Percentage",
    discountName: "LMS Draft DISCOUNT",
}

type CreateDiscountStatus = 'Active' | 'Draft'

export class Discounts {
    disLocators: discountLocators;
    // private mode: string; // "CREATE" | "EDIT" | "VIEW"
    private ipsData?: DiscountFormData;
    private status?: CreateDiscountStatus

    page: any;

    constructor(page: Page, status: CreateDiscountStatus = 'Active', formData?: DiscountFormData) {
        this.page = page;
        this.disLocators = new discountLocators(page);
        this.ipsData = formData
        this.status = status;
    }
    async createDiscounts(): Promise<void> {
        switch (this.status) {
            case 'Active': {
                if (!this.ipsData) throw new Error('Form data is required for CREATE mode');
                await this.disLocators.clickCreateNewDiscount();
                await this.fillOutNewDiscountForm();
                await this.submitDiscount(this.status);
                break;
            }
            case 'Draft': {
                if (!this.ipsData) throw new Error('Form data is required for CREATE mode');
                await this.disLocators.clickCreateNewDiscount();
                await this.fillOutNewDiscountForm();
                await this.submitDiscount(this.status);
                break;
            }
        }
    }
    async editDiscounts(): Promise<void> {
        if (!this.ipsData) throw new Error('Form data is required for EDIT mode');
        await this.disLocators.clickEditDiscount();
        await this.fillOutEditDiscountForm();
    }
    async sendVouchers(): Promise<void> {
        console.log('Sending Voucher mode');
    }
    async viewDiscounts(): Promise<void> {
        console.log("Discount View");
        await expect(this.page.locator('#rc-tabs-1-tab-detail')).toContainText('Discount Details');
        await expect(this.page.locator('#rc-tabs-1-tab-holder')).toContainText('Voucher Holders');
        await expect(this.page.getByLabel('Discount Details')).toContainText('Discount Details');

        await expect(this.page.getByLabel('Discount Details')).toContainText('Discount Setup');
        await expect(this.page.getByLabel('Discount Details')).toContainText('Business Group');
        await expect(this.page.getByLabel('Discount Details')).toContainText('Voucher Provider Name');
        await expect(this.page.getByLabel('Discount Details')).toContainText('Voucher Title');
        await expect(this.page.getByLabel('Discount Details')).toContainText('Discount Name');
        console.log("Discount View");
    }
    async createNewDiscount(): Promise<void> {
        await this.disLocators.clickCreateNewDiscount();
        await this.fillOutNewDiscountForm();
        await this.submitDiscount(this.status as CreateDiscountStatus);
        // await this.waitForAlertAndLog(this.page, {
        //     'These credentials do not match our records': '❌ Error alert shown',
        //     'Discount Created!': '✅> Test1 passed',
        // });
        await this.checkActionAlert({
            'Discount Created!': '✅ Discount creation alert verified',
            'Discount Updated!': '✅ Discount updated alert verified',
        });
    }

    async submitDiscount(status: 'Draft' | 'Active'): Promise<void> {
        if (status === 'Draft') {
            await this.disLocators.btnSaveAsDraft.waitFor({ state: 'visible' });
            await this.disLocators.btnSaveAsDraft.click();
        } else if (status === 'Active') {
            await this.disLocators.btnCreateDisocunt.waitFor({ state: 'visible' });
            await this.disLocators.btnCreateDisocunt.click();
        } else {
            throw new Error(`Unknown status: ${status}`);
        }
    }

    private async updateValueIfChanged(locator: Locator, value: string): Promise<void> {
        const tag = await locator.evaluate(domNode => domNode.tagName.toLowerCase());

        console.log(`Tag: ${tag}`);
        if (tag === 'input' || tag === 'textarea') {
            const current = await locator.inputValue();
            console.log(`Current value: ${current}`);
            if (current !== value) {
                await locator.fill(value);
                console.log(`Updated input/textarea field to: ${value}`);
            } else {
                console.log('No update needed, value is already set.');
            }
        } else if (tag === 'select') {
            await locator.selectOption(value);
            console.log(`Selected option: ${value}`);
        } else {
            console.warn(`Unsupported tag type: ${tag}`);
        }
    }

    async fillOutNewDiscountForm(): Promise<void> {
        if (!this.ipsData) {
            throw new Error("Discount data is not set. Ensure that `discountCriteria` was called first.");
        }
        await this.page.waitForTimeout(2000);

        console.log("fillOutDiscountForm: " + this.ipsData.country);

        // Business Group
        await this.disLocators.selectBizGroup();

        if (this.ipsData.country == 'SG') {
            console.log("COUNTRY : " + this.ipsData.country);

            // Discount Name
            await this.disLocators.txtDisocuntName.fill(this.ipsData.discount_name ?? '')
            // Voucher Title
            await this.disLocators.txtVoucherTitle.fill(this.ipsData.voucher_title ?? '')
            // Category
            await this.page.getByLabel('Category').click();
            console.log('category :' + inputText.category)
            await this.page.waitForTimeout(1000);
            await this.page.getByText(`${inputText.category}`);
            const categoryOptions = this.page.locator('.ant-select-item-option-content', { hasText: `${inputText.category}` });
            await categoryOptions.click();

            await this.page.locator('#voucher_provider_name').fill(`${inputText.voucherProvider}`);
            await this.page.locator('[id="__next"]').getByTitle(`${inputText.category}`).first().click();
            await this.page.getByTitle(`${inputText.category}`).nth(1).click();
            // Description
            await this.disLocators.txtDescription.fill(this.ipsData.description ?? '')
            // Terms & Conditions
            await this.disLocators.txtTermsAndConditions.fill(this.ipsData.terms_and_conditions ?? '')
            await this.disLocators.txtDiscountType.click();
            if (this.ipsData.discount_type == "FixedAmt") {
                await this.page.getByText('Fixed Amount').first().click();
                await expect(this.page.locator('form')).toContainText(`${this.ipsData.currencySign}`);
                await expect(this.page.getByText(`${this.ipsData.currencySign}`)).toBeVisible();
                await this.page.getByLabel('Amount', { exact: true }).fill(this.ipsData.discount_amount);
            } else {
                await this.page.getByTitle('Percentage').locator('div').click();
                await expect(this.page.getByText('%', { exact: true })).toBeVisible();
                await expect(this.page.locator('form')).toContainText('%');
                this.ipsData.discount_amount = inputText.discount_amount_percentage;
                await this.page.getByLabel('Amount', { exact: true }).fill(this.ipsData.discount_amount);
            }
            if (this.ipsData.minimumPurchase) {
                await this.page.getByText('Minimum purchase amount').click();
                await this.page.getByPlaceholder('Amount').click();
                await this.page.getByPlaceholder('Amount').fill(this.ipsData.minimum_purchase_amount ?? '');
            }
            if (this.ipsData.maxiDiscountUses?.isLimitAvailableQty) {
                await this.page.getByLabel('Limit available quantity').check();
                await this.disLocators.txtAvailableQty.fill(inputText.limitAvailableQty);
            }
            await this.page.locator('#expiry_duration_type').click();
            if (this.ipsData.VoucherExpiration?.expiryType == "fromIssueDate") {
                await this.page.getByText('From Issue Date').click();
                await this.page.locator('#expiry_duration').click();
                await this.page.locator('#expiry_duration').fill(inputText.limitAvailableQty);

                await this.page.locator('#expiry_duration_unit').click();
                await this.page.getByText('Months', { exact: true }).click();
            } else {
                await this.page.getByText('Fixed Date').first().click();
                await this.page.getByPlaceholder('Select date').click();
                // await this.clickByFlexibleText(this.ipsFormData.VoucherExpiration.discountExpiryOn);
                await this.page.getByText(this.ipsData.VoucherExpiration.discountExpiryOn, { exact: true }).click();
                console.log("ipsFormData.VoucherExpiration.discountExpiryOn : " + this.ipsData.VoucherExpiration.discountExpiryOn)
            }

            // Discount Value
            const DiscountTypelocator = this.page.locator('span.ant-select-selection-item').nth(4);
            const currentDiscountType = await DiscountTypelocator.getAttribute('title');
            console.log('currentCategory :' + currentDiscountType)
            if (currentDiscountType != inputText.discountType) {
                await DiscountTypelocator.click();
                await this.page.waitForTimeout(1000);
                await this.page.getByText(`${inputText.discountType}`);
                const DiscountTypeOptions = this.page.locator('.ant-select-item-option-content', { hasText: `${inputText.discountType}` });
                await DiscountTypeOptions.click();
                console.log(`Updated drop-down field to: ${inputText.discountType}`);
            } else {
                console.log('No update needed, value is already set.');
            }
        }
    }
    async fillOutEditDiscountForm(): Promise<void> {
        if (!this.ipsData) {
            throw new Error("Discount data is not set. Ensure that `discountCriteria` was called first.");
        }
        await this.page.waitForTimeout(2000);

        console.log("fillOutDiscountForm: " + this.ipsData.country);
        await this.updateValueIfChanged(this.disLocators.txtVoucherProviderName, this.ipsData.voucher_provider_name);
        await this.updateValueIfChanged(this.disLocators.txtDisocuntName, this.ipsData.discount_name);
        await this.updateValueIfChanged(this.disLocators.txtVoucherTitle, this.ipsData.voucher_title);
        await this.updateValueIfChanged(this.disLocators.txtDescription, this.ipsData.description);
        await this.updateValueIfChanged(this.disLocators.txtTermsAndConditions, this.ipsData.terms_and_conditions);

        // Category
        const categorylocator = this.page.locator('span.ant-select-selection-item').nth(3);
        const currentCategory = await categorylocator.getAttribute('title');
        console.log('currentCategory :' + currentCategory)
        if (currentCategory != inputText.category) {
            await categorylocator.click();
            await this.page.waitForTimeout(1000);
            await this.page.getByText(`${inputText.category}`);
            const categoryOptions = this.page.locator('.ant-select-item-option-content', { hasText: `${inputText.category}` });
            await categoryOptions.click();
            console.log(`Updated drop-down field to: ${inputText.category}`);
        } else {
            console.log('No update needed, value is already set.');
        }
        // if (mode === 'create') {
        // Business Group
        await this.disLocators.selectBizGroup();
        // }
        if (this.ipsData.country == 'SG') {
            console.log("COUNTRY : " + this.ipsData.country);

            // Discount Name
            await this.disLocators.txtDisocuntName.fill(this.ipsData.discount_name ?? '')
            // Voucher Title
            await this.disLocators.txtVoucherTitle.fill(this.ipsData.voucher_title ?? '')
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
            await this.disLocators.txtDescription.fill(this.ipsData.description ?? '')
            // Terms & Conditions
            await this.disLocators.txtTermsAndConditions.fill(this.ipsData.terms_and_conditions ?? '')
            await this.disLocators.txtDiscountType.click();
            if (this.ipsData.discount_type == "FixedAmt") {
                await this.page.getByText('Fixed Amount').first().click();
                await expect(this.page.locator('form')).toContainText(`${this.ipsData.currencySign}`);
                await expect(this.page.getByText(`${this.ipsData.currencySign}`)).toBeVisible();
                await this.page.getByLabel('Amount', { exact: true }).fill(this.ipsData.discount_amount);
            } else {
                await this.page.getByTitle('Percentage').locator('div').click();
                await expect(this.page.getByText('%', { exact: true })).toBeVisible();
                await expect(this.page.locator('form')).toContainText('%');
                this.ipsData.discount_amount = inputText.discount_amount_percentage;
                await this.page.getByLabel('Amount', { exact: true }).fill(this.ipsData.discount_amount);
            }
            if (this.ipsData.minimumPurchase) {
                await this.page.getByText('Minimum purchase amount').click();
                await this.page.getByPlaceholder('Amount').click();
                await this.page.getByPlaceholder('Amount').fill(this.ipsData.minimum_purchase_amount ?? '');
            }
            if (this.ipsData.maxiDiscountUses?.isLimitAvailableQty) {
                await this.page.getByLabel('Limit available quantity').check();
                await this.disLocators.txtAvailableQty.fill(inputText.limitAvailableQty);
            }
            await this.page.locator('#expiry_duration_type').click();
            if (this.ipsData.VoucherExpiration?.expiryType == "fromIssueDate") {
                await this.page.getByText('From Issue Date').click();
                await this.page.locator('#expiry_duration').click();
                await this.page.locator('#expiry_duration').fill(inputText.limitAvailableQty);

                await this.page.locator('#expiry_duration_unit').click();
                await this.page.getByText('Months', { exact: true }).click();
            } else {
                await this.page.getByText('Fixed Date').first().click();
                await this.page.getByPlaceholder('Select date').click();
                // await this.clickByFlexibleText(this.ipsFormData.VoucherExpiration.discountExpiryOn);
                await this.page.getByText(this.ipsData.VoucherExpiration.discountExpiryOn, { exact: true }).click();
                console.log("ipsFormData.VoucherExpiration.discountExpiryOn : " + this.ipsData.VoucherExpiration.discountExpiryOn)
            }

            // Discount Value
            const DiscountTypelocator = this.page.locator('span.ant-select-selection-item').nth(4);
            const currentDiscountType = await DiscountTypelocator.getAttribute('title');
            console.log('currentCategory :' + currentDiscountType)
            if (currentDiscountType != inputText.discountType) {
                await categorylocator.click();
                await this.page.waitForTimeout(1000);
                await this.page.getByText(`${inputText.discountType}`);
                const DiscountTypeOptions = this.page.locator('.ant-select-item-option-content', { hasText: `${inputText.discountType}` });
                await DiscountTypeOptions.click();
                console.log(`Updated drop-down field to: ${inputText.discountType}`);
            } else {
                console.log('No update needed, value is already set.');
            }
        }
    }
    async getDiscountID(): Promise<DiscountDetails | void> {
        await expect(this.page.locator('.ant-notification-notice-message')).toContainText('Discount Created!');
        const messageDesc = this.page.locator('.ant-notification-notice-description');
        console.log('messageDesc: ', messageDesc);
        await expect(messageDesc).toBeVisible();
        const messageDescText = await messageDesc.textContent();
        if (!messageDescText) return
        console.log('messageDescText:', messageDescText);
        // Regex to match discount code, name, and action (created/updated)
        const match = messageDescText.match(/discount (\d+) (.+?) has been (created|updated)/i);
        if (match) {
            const discountID = match[1];  // e.g., "00208"
            const discountName = match[2]; // eg., LMS
            const discountAction = match[3]; // e.g., "Created"
            console.log("Extracted Discount ID:", discountID);
            console.log("Extracted Discount Name:", discountName);
            console.log("Extracted Action:", discountAction);
            return new DiscountDetails(discountID, discountName, discountAction);
        } else {
            console.error("Failed to extract discount info from notification.");
        }
    }

    async clickDiscountById(discountID: string): Promise<void> {
        await this.page.locator('[id="__next"]').getByText('Discount Name', { exact: true }).click();
        await this.page.getByText('Discount ID', { exact: true }).click();
        await this.disLocators.txtSearch.click();
        await this.disLocators.txtSearch.fill(discountID);
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
    async assertDiscountDetailsVisible(discountDetail: DiscountDetails): Promise<void> {
        const { discountID, discountName, discountAction } = discountDetail;
        const idLocator = this.page.locator('.discount-id');
        const nameLocator = this.page.locator('.discount-name');
        const actionLocator = this.page.locator('.discount-action');
        await expect(idLocator).toBeVisible();
        await expect(idLocator).toHaveText(discountID);
        await expect(nameLocator).toBeVisible();
        await expect(nameLocator).toHaveText(discountName);
        await expect(actionLocator).toBeVisible();
        await expect(actionLocator).toHaveText(discountAction);
    }
    async waitForAlertAndLog(expectedMessages: Record<string, string>): Promise<string | undefined> {
        const title = this.page.locator('.ant-notification-notice-message');
        const desc = this.page.locator('.ant-notification-notice-description');

        await expect(title).toBeVisible({ timeout: 5000 });
        await expect(desc).toBeVisible({ timeout: 5000 });

        const titleText = (await title.textContent())?.trim() || '';
        const descText = (await desc.textContent())?.trim() || '';

        console.log('🔔 Alert Title:', titleText);
        console.log('📄 Alert Description:', descText);

        for (const [expected, logMessage] of Object.entries(expectedMessages)) {
            if (titleText.includes(expected) || descText.includes(expected)) {
                console.log(logMessage);
                return descText || titleText;
            }
        }
        console.warn('⚠️ No expected alert matched:', titleText, descText);
        return descText || titleText;
    }

    async clickByFlexibleText(targetText: string): Promise<void> {
        const variants = new Set<string>();
        // Always try the original input
        variants.add(targetText);
        // If it starts with a 0, also try the unpadded version
        if (/^0\d+$/.test(targetText)) {
            const unpadded = targetText.replace(/^0+/, '');
            variants.add(unpadded);
        }
        for (const variant of variants) {
            const locator = this.page.getByText(variant, { exact: true });
            if (await locator.isVisible()) {
                await locator.click();
                console.log(`✅ Clicked on text: "${variant}"`);
                return;
            }
        }
        console.log("targetText : " + targetText);
        throw new Error(`❌ Unable to find element with text: "${targetText}" or its unpadded form.`);
    }


    async checkActionAlert(expectedMessages: Record<string, string>): Promise<void> {
        const title = this.page.locator('.ant-notification-notice-message');
        const desc = this.page.locator('.ant-notification-notice-description');

        await expect(title).toBeVisible({ timeout: 5000 });
        await expect(desc).toBeVisible({ timeout: 5000 });

        const titleText = (await title.textContent())?.trim() || '';
        const descText = (await desc.textContent())?.trim() || '';

        console.log('🔔 Title:', titleText);
        console.log('📄 Description:', descText);

        for (const [expected, logMessage] of Object.entries(expectedMessages)) {
            if (titleText.includes(expected) || descText.includes(expected)) {
                console.log(logMessage);
                return;
            }
        }
        console.warn('⚠️ Unexpected alert:', titleText, descText);
    }

}