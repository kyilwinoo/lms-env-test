import { Page, expect } from '@playwright/test';
import { voucherLocators } from '../components/Locators/voucher-locators';

export class VoucherActions {
    private locators: voucherLocators;
    page: any;

    constructor(page: Page) {
        this.page = page;
        this.locators = new voucherLocators(page);
    }
    async sendVoucher(discountID: string): Promise<void> {
        try {
            // Check if the "Maximum Discount" exists on the page by locating it
            const btnSendVoucher = this.page.getByRole('button', { name: 'Send Voucher' });

            if (await btnSendVoucher.isEnabled()) {
                await btnSendVoucher.click();
                // Tab1
                // await this.SearchContact(discountID);
                // Tab2
                //await uploadCSV(page)
                // await this.page.getByRole('button', { name: 'Send', exact: true }).click();
                // await this.page.locator('.ant-notification-notice').click();
                // await expect(page.locator('body')).toContainText('Successfully save!');

            }
        } catch (error) {
            console.error("Error during sendVoucher process:", error);
            // Handle the error if needed (e.g., rethrow or log it).
        }
        // const maximumDiscountLocator = await this.page.getByText('Maximum Discount Uses');
        // const textCount = await maximumDiscountLocator.count();
        // if (textCount > 0) {
        //     console.log("Maximum Discount exists on the page.");
        //     const availableQuantity = await this.page.locator("//div[text()='Available Quantity']/following-sibling::div").innerText();
        //     console.log("Available Quantity: ✅ '", availableQuantity);
        // } else {
        //     console.log("Maximum Discount does not exist on the page.");
        // }


    }
    async SearchContact(customerID: string): Promise<void> {
        try {
            // Search Contact
            const selectBox = this.page.getByText('Search by name, ID, contact number');
            await selectBox.waitFor({ state: 'visible' });

            const searchContact = await this.page.locator('//html[1]/body[1]/div[2]/div[1]/div[3]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/span[1]/input[1]');
            await searchContact.click();
            await searchContact.fill(customerID);

            // Locate the customer item with the matching ID
            const customerItem = this.page.locator(`.rc-virtual-list-holder-inner div[id="${customerID}"]`);
            console.log("Searching for Customer Item with ID: " + customerID);

            // Wait for the customer item to become visible within a timeout
            await customerItem.waitFor({ state: 'visible', timeout: 5000 });

            // Check if the customer item is visible and click it
            if (await customerItem.isVisible()) {
                await customerItem.click();
                console.log(`✅ Customer with ID ${customerID} is selected.`);

                // Find the contact link using the customer ID and log the Contact ID
                const contactLink = await this.page.locator(`a[href="https://staging-carro-ticket-web.getcarsstaging.com/contacts/${customerID}"]`);
                const contactId = await contactLink.textContent();
                console.log('Contact ID:', contactId);

                // Log the link text of the customer link to confirm selection
                const linkLocator = this.page.locator('.ant-space-item > a');
                console.log('Customer Link Text:', await linkLocator.textContent());
            } else {
                throw new Error(`❌ Customer with ID ${customerID} not found.`);
            }
        } catch (error) {
            console.error(`Error while searching for Customer ID ${customerID}:`, error);
        }
    }
}

