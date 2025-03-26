import { test, Page, expect } from '@playwright/test';
import { login } from '../page-objects/login'; // Import the login function
import fs from 'fs'

import { Utility } from '../components/Locators/utility'; // Import the login function

const inpDiscountData = {
    exportOption: 3,
    byIssuedDate: false, //redeemedDate
    issuedDate: "-01-27",
    redeemedDate: null,
    dateType: "Between", // Is or Between,
    inpDiscountID: "00157", // Limit 55 00157, 00153, no limit 00117, 
    discountStatus: "Active",
    endDate: "-02-05",
}

test.skip('Login', async ({ page }) => {
    await login(page)
})

test.describe('Export all excel', () => {

    const testCases = [
        {
            exportOption: 1,
            description: "Export All Vouchers Created Since Day 1",
        },
        {
            exportOption: 2,
            byIssuedDate: true,
            issuedDate: "-01-27",
            dateType: "Is",
            description: "Export All Vouchers Based on Issued Date (Single Date)",
        },
        {
            exportOption: 2,
            byIssuedDate: false,
            redeemedDate: { start: "-01-25", end: "-02-05" },
            dateType: "Between",
            description: "Export All Vouchers Based on Redemption Date (Date Range)",
        },
        {
            exportOption: 3,
            createdDate: "-01-20",
            description: "Export All Vouchers Based on Created Date",
        },
    ];

    // Loop through each test case
    for (const testData of testCases) {
        test(`${testData.description}`, async ({ page }) => {
            await login(page)
            console.log(`🚀 Running: ${testData.description}`);
            await page.getByRole('button', { name: 'EXPORT XLSX' }).click();

            // Select 'Business Group'
            await page.getByLabel('Business Group').click();
            await page.getByTitle('Carro Care [SG]').locator('div').click();

            console.log("Starting export process...")

            switch (inpDiscountData.exportOption) {
                case 1:
                    console.log("Export All Vouchers Created Since Day 1")
                    await page.getByText('Export All discount Created Since Day 1').click();
                    break;
                case 2:
                    console.log("Export All Vouchers Based On A Date")
                    const exportOption2 = page.getByText('Export All Vouchers Based On A Date');
                    await expect(exportOption2).toBeVisible();
                    await exportOption2.click();
                    await dateSelection(page);
                    break;
                case 3:
                    console.log("Export Unredeemed Vouchers As Of A Specific Date")
                    const exportOption3 = page.getByText('Export Unredeemed Vouchers As Of A Specific Date');
                    await expect(exportOption3).toBeVisible();
                    await exportOption3.click();
                    await page.locator('#single_date').click();
                    await page.getByTitle(inpDiscountData.issuedDate).locator('div').click();
                    break;
                default:
                    throw new Error("X Invalid export option selected!");
            }
            await page.getByRole('button', { name: 'Export', exact: true }).click();
            const downloadPromise = page.waitForEvent('download');
            const download = await downloadPromise;

            // Define the download path
            const downloadPath = `./downloads/${download.suggestedFilename()}`;

            // Save the file
            await download.saveAs(downloadPath);
            console.log(`✅ Excel file downloaded: ${downloadPath}`);

            // Verify the file exists
            if (fs.existsSync(downloadPath)) {
                console.log("✅ File exists: " + downloadPath);
            } else {
                console.error("❌ Downloaded file not found!");
            }
        });
    }
})


    async function dateSelection(page) {
        await page.locator('#date_type').click();
        if (inpDiscountData.byIssuedDate) {
            await page.locator('.ant-select-item-option-content').getByText('Issued Date').click();
        } else {
            await page.locator('.ant-select-item-option-content').getByText('Redemption Date').click();
        }
        if (inpDiscountData.dateType === "Is") {
            await page.locator('#date_operator').click();
            await page.getByTitle('Is', { exact: true }).click();
            await singleDateSelection(page, '#single_date', inpDiscountData.issuedDate)
        } else if (inpDiscountData.dateType == "Between") {
            await page.locator('#date_operator').click();
            await page.getByTitle('Is Between', { exact: true }).click();
            await dateRangeSelection(page, '#start_end_date', inpDiscountData.issuedDate, inpDiscountData.endDate)
        }
    }

    async function singleDateSelection(page, dateLocator, dateValue) {
        await expect(page.locator(dateLocator)).toBeVisible();
        await page.locator(dateLocator).click();
        await expect(page.getByTitle(dateValue).locator('div')).toBeVisible();
        await page.getByTitle(dateValue).locator('div').click();
    }
    async function dateRangeSelection(page, dateLocator, startDate, endDate) {
        await expect(page.locator(dateLocator)).toBeVisible();
        await page.locator(dateLocator).click();
        await expect(page.getByTitle(startDate).locator('div')).toBeVisible();
        await page.getByTitle(startDate).locator('div').click();
        await expect(page.getByPlaceholder('End date')).toBeVisible();
        await page.getByTitle(endDate).locator('div').first().click();
        // await page.getByTitle(`${inpDiscountData.issuedDate}`).locator('div').click();
        // await page.getByTitle(`${inpDiscountData.endDate}`).locator('div').first().click();

    }
