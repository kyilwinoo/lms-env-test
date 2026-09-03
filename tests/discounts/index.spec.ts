import { test } from '@playwright/test';
import { discountCriteriaMap } from '../test-data/discount-criteria';
import { Discounts } from '../page-objects/discount-page';
import { VoucherActions } from '../page-objects/voucher-page';
import { config } from '@/config'
let discountCreation: Discounts;
let voucherActions: VoucherActions;

const ipsFormData = discountCriteriaMap['NoMinimumPurchase']

test('playground', async ({ page }) => {
    // const discountID = '00222'; //00220 Draft, 00233
    await page.goto(`${config.domains.lms.baseUrl}`)
    await page.waitForTimeout(5000);
    const discountCreation = new Discounts(page,'Draft', ipsFormData);
    const voucherActions = new VoucherActions(page);
    await discountCreation.createNewDiscount();
})

