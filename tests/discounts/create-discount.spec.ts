// @ts-check
import { test } from '@playwright/test';
import { login } from '../page-objects/login'; // Import the login function
import dotenv from 'dotenv';
import { discountCriteriaMap } from '../test-data/discount-criteria';
import { Discounts } from '../page-objects/discount-page';
import { VoucherActions } from '../page-objects/voucher-page';
import { STORAGE_STATE } from '@/playwright.config'
import path from 'path';
import { config } from '@/config'
dotenv.config();
const envs = process.env.ENVIRONMENT || "STG";
let discountCreation: Discounts;
let voucherActions: VoucherActions;

const ipsFormData = discountCriteriaMap['NoMinimumPurchase']

// -----------------------------
// 1) Discount Creation Tests
// -----------------------------
test(`Run Discount creation: NoMinimumPurchase and Send Voucher`, async ({ page }) => {
    // const discountID = '00222'; //00220 Draft, 00233
    // await page.goto(`${config.domains.lms.baseUrl}`)
    await page.goto("https://lms.stg.getcars.dev/")
    await page.waitForTimeout(5000);
    const discountCreation = new Discounts(page, 'Active', ipsFormData);
    const voucherActions = new VoucherActions(page);
    await discountCreation.createNewDiscount();

    const discountDetails = await discountCreation.getDiscountID();
    if (discountDetails) {
        await discountCreation.clickDiscountById(discountDetails.discountID);
        await voucherActions.sendVoucher("1423305");
        // Assert detail page shows correct data
        await discountCreation.assertDiscountDetailsVisible(discountDetails);
    } else {
        console.log('No discount details found.');
    }
})

// -----------------------------
// 1) Discount Creation Tests
// -----------------------------
test(`Run Discount creation (Draft): NoMinimumPurchase and Send Voucher`, async ({ page }) => {
    // const discountID = '00222'; //00220 Draft, 00233
    await page.goto(`${config.domains.lms.baseUrl}`)
    await page.waitForTimeout(1000);
    const discountCreation = new Discounts(page, 'Draft', ipsFormData);
    const voucherActions = new VoucherActions(page);
    await discountCreation.createNewDiscount();

    // const discountDetails = await discountCreation.waitForAlertAndLog();
    // if (discountDetails) {
    //     console.log(' Discount ID:', discountDetails);
    //     console.log(' Name:', discountDetails.discountName);
    //     console.log(' Action:', discountDetails.discountAction);
    // }
    const discountDetails = await discountCreation.getDiscountID();
    if (discountDetails) {
        await discountCreation.clickDiscountById(discountDetails.discountID);
        await voucherActions.sendVoucher("1423305");
        // Assert detail page shows correct data
        await discountCreation.assertDiscountDetailsVisible(discountDetails);
    } else {
        console.log('No discount details found.');
    }
})

// -----------------------------
// 2) Sending Voucher in Existing Discount Tests
// -----------------------------
test(`Sending Voucher in Existing Discount`, async ({ page }) => {
    const discountID = '00294'; //00220 Draft, 00233
    await page.goto(`${config.domains.lms.baseUrl}`)
    await page.waitForTimeout(9000);
    const discountCreation = new Discounts(page, 'Active', ipsFormData);
    await discountCreation.clickDiscountById(discountID);
    const voucherActions = new VoucherActions(page);
    await voucherActions.sendVoucher("1423324");
})
// -----------------------------
// 3) Edit Existing Discount Tests
// -----------------------------

test.skip(`Edit Existing Discount`, async ({ page }) => {
    const discountID = '00075'; //00220 Draft, 00233 , QA Draft 00075
    await page.goto(`${config.domains.lms.baseUrl}`)
    await page.waitForTimeout(2000);
    const discountCreation = new Discounts(page, ipsFormData);
    await discountCreation.clickDiscountById(discountID);
    const voucherActions = new VoucherActions(page);
    await discountCreation.editDiscounts();
    // Assert detail page shows correct data
    // await discountCreation.assertDiscountDetailsVisible(discountDetails);

})