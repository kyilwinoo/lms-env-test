import { test } from '@playwright/test';
import { login } from '../page-objects/login'; // Import the login function
import dotenv from 'dotenv';
import { getDiscountDescription } from '../test-data/discount-criteria';
import { createDiscounts } from '../page-objects/discount-page';
import { VoucherActions } from '../page-objects/voucher-page';

dotenv.config();
const envs = process.env.ENVIRONMENT || "STG";
let discountCreation: createDiscounts;
let voucherActions: VoucherActions;


const inputDescription = "NoMinimumPurchase";
const ipsFormData = getDiscountDescription(inputDescription);
if (!ipsFormData) {
    throw new Error("Form data not found for the given description");
}
test(`Run DiscountDiffScenario: ${ipsFormData.test_description}`, async ({ page }) => {
    // test(`Run DiscountDiffScenario`, async ({ page }) => {
    await login(page)
    discountCreation = new createDiscounts(page, "CREATE");
    voucherActions = new VoucherActions(page);
    await discountCreation.setFormData(ipsFormData);
    await discountCreation.createNewDiscount();
    // const discountDetails = await discountCreation.getDiscountID();

    // if (discountDetails) {
    //     console.log('Discount Code:', discountDetails.getDiscountID);
    //     console.log('Discount Name:', discountDetails.getDiscountName);
    //     console.log('Discount Action:', discountDetails.getDiscountAction);
    //     await discountCreation.clickDiscountById(discountDetails.getDiscountID);
    //     await voucherActions.sendVoucher("1423324");
    // } else {
    //     console.log('No discount details found.');
    // }
})
/*
    discountCreation.setFormData(ipsFormData);
    await discountCreation.createOrEditDiscount();
    // Wait for the discount to be created and fetch the discount details
    const discountDetails = await discountCreation.getDiscountID();
    if (discountDetails) {
        console.log("Discount ID:", discountDetails.getDiscountID);
        console.log("Discount Name:", discountDetails.getDiscountName);
        console.log("Discount Action:", discountDetails.getDiscountAction);
        await discountCreation.clickDiscountById(discountDetails.getDiscountID);
        await voucherActions.sendVoucher(discountDetails.getDiscountID);
        
    } else {
        console.log("Failed to get discount details.");
    }
        */