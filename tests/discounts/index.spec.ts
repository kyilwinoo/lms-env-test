import { test } from '@playwright/test';
import { getDiscountDescription } from '../test-data/discount-criteria';
import { createDiscounts } from '../page-objects/discount-page'; 
import { VoucherActions } from '../page-objects/voucher-page';
import { config } from '@/config'
let discountCreation: createDiscounts;
let voucherActions: VoucherActions;
const inputDescription = "NoMinimumPurchase";
const ipsFormData = getDiscountDescription(inputDescription);
if (!ipsFormData) {
    throw new Error("Form data not found for the given description");
}
test('playground', async ({ page }) => {
    console.log('page', `${config.domains.lms.baseUrl}`);
    await page.goto(`${config.domains.lms.baseUrl}/discount/new`)
       discountCreation = new createDiscounts(page, "CREATE");
        voucherActions = new VoucherActions(page);
        await discountCreation.setFormData(ipsFormData);
        await discountCreation.createNewDiscount();
})

