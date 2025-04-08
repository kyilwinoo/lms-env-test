import { test, expect } from '@playwright/test';
import { login } from '../page-objects/login'; // Import the login function
import { loadCustomerIDs } from '../discounts/disocunt-helper';
import { createDiscounts } from '../page-objects/discount-page';
import { VoucherActions } from '../page-objects/voucher-page';

let discountCreation: createDiscounts;
let voucherActions: VoucherActions;

test('Verify customer selection using CSV data', async ({ page }) => {
    await login(page)
    discountCreation = new createDiscounts(page, "CREATE");
    await discountCreation.clickDiscountById("00222");
    // Load Customer IDs from CSV before interacting with the page
    const customerIDs: string[] = await loadCustomerIDs();
    console.log('🚀 Loaded Customer IDs:', customerIDs);
    voucherActions = new VoucherActions(page);
    voucherActions.sendVoucher("00222");
    // Loop through each customer ID and verify selection
    for (const customerID of customerIDs) {
        await voucherActions.SearchContact(customerID);
    }
});