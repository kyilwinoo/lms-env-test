import { test, Page, expect } from '@playwright/test';
import { login } from '../page-objects/login'; // Import the login function
import { promises as fs } from 'fs'
import { Utility } from '../components/Locators/utility'; // Import the login function


const inpVoucherData = {
    inpDiscountID: "00169", // Limit 55 00157, 00153, no limit 00117, 
    discountStatus: "Active",
    customerId: "1423324"
}

test.beforeEach('Login', async ({ page }) => {
    await login(page)
})

test('send voucher', async ({ page }) => {
    await page.locator('[id="__next"]').getByText('Discount Name', { exact: true }).click();
    await page.getByText('Discount ID', { exact: true }).click();
    const searchBox = page.getByPlaceholder('Search');
    await searchBox.click();
    await searchBox.fill(inpVoucherData.inpDiscountID);
    await page.getByRole('button', { name: 'search' }).click();
    await page.waitForTimeout(2000)
    await page.waitForSelector('td > a > span.discount-id-span.css-10iahqc', { timeout: 5000 });
    await page.locator('td > a > span.discount-id-span.css-10iahqc', { hasText: `ID ${inpVoucherData.inpDiscountID}` }).first().click();
    await page.waitForTimeout(2000)
    const textCount = await page.getByText('Maximum Discount Uses').count();
    if (textCount > 0) {
        console.log("Maximum Discount exists on the page.");
        const availableQuantity = await page.locator("//div[text()='Available Quantity']/following-sibling::div").innerText();
        console.log("Available Quantity: ✅ '", availableQuantity);
    } else {
        console.log("Maximum Discount does not exist on the page.");
    }
    const btnSendVoucher = await page.getByRole('button', { name: 'Send Voucher' });

    if (await btnSendVoucher.isVisible()) {
        if (await btnSendVoucher.isEnabled()) {
            await page.getByRole('button', { name: 'Send Voucher' }).click();
            // Tab1
            await SearchContact(inpVoucherData.inpDiscountID)
            // Tab2
            //await uploadCSV(page)
            await page.getByRole('button', { name: 'Send', exact: true }).click();
            await page.locator('.ant-notification-notice').click();

            // await expect(page.locator('body')).toContainText('Successfully save!');
        }
    }
})
const uploadCSV = async (page: Page) => {

    const uploadCSV = await page.locator('[data-node-key="upload-csv"]')
    await uploadCSV.waitFor();
    await uploadCSV.click();

    const chooseFile = await page.locator('.css-1y8tndw');
    await chooseFile.waitFor();
    await chooseFile.click();
    await page.setInputFiles('input[type="file"]', 'assets/2200001 5.csv');
    // 
    await expect(page.locator('#rc-tabs-2-tab-upload-csv')).toContainText('5');

    // await uploadSalesContract.locator('input').setInputFiles('assets/Blank.pdf')
}
const SearchContact = async (page) => {
    const selectBox = page.getByText('Search by name, ID, contact number');
    await selectBox.waitFor({ state: 'visible' });
    const searchContact = await page.locator('//html[1]/body[1]/div[2]/div[1]/div[3]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/span[1]/input[1]')
    await searchContact.click();
    // await searchContact.fill(inpDiscountData.customerId); // 1422980 Edit By Carro Care Apps NK
    // await page.getByText('Indigo').click();

    // await page.getByText('+65911*****nang***@').click();
    // await page.getByPlaceholder('Add Car Plate No.').click();
    // await page.getByPlaceholder('Add Car Plate No.').fill('A');
    // await page.getByRole('button', { name: 'Save' }).click();
}
/* search
 // const searchResult = await page.locator('td > a > span.discount-id-span.css-10iahqc').first().innerText()
    // const expectedID = searchResult.replace(/\s+/g, '').trim(); // Remove spaces
    // console.log("expectedID: " + expectedID)
    // const searchLocator = await page.locator(`#copy-id-${inpDiscountData.inpDiscountID}`).count()
    // const locator = await page.locator(`#copy-id-00158`).count()
    // console.log("locator:158 " + locator)
    // const locator = page.locator(`//span[@id='copy-id-00124']`);
    // if (expectedID == `ID${inpDiscountData.inpDiscountID}`) {
    //     console.log("matched!")
    //     await page.locator('td > a > span.discount-id-span.css-10iahqc', { hasText: `ID ${inpDiscountData.inpDiscountID}` }).click();
    // }
    */