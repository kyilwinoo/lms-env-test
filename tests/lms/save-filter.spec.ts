import { test, Page, expect } from '@playwright/test';
import { login } from '../page-objects/login'; // Import the login function
import { promises as fs } from 'fs'
import { Utility } from '../components/Locators/utility'; // Import the login function

test.beforeEach('Login', async ({ page }) => {
    await login(page)
})
const filterName = "Test Filter";

test('save filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    // await page.locator('div:nth-child(4) > .ant-row > div:nth-child(2) > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
    await page.getByText('Created By').click();
    // await page.getByLabel('Created By').click();
    // await page.getByTitle('Active', { exact: true }).locator('div').click();
    await page.locator('#creator').click();
    await page.getByText('Nang Kyi Lwin Oo').nth(3).click();
    await page.locator('div:nth-child(3) > .ant-row > div:nth-child(2) > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector').click();
    await page.getByText('7 Days', { exact: true }).click();
    await page.locator('div:nth-child(6) > .ant-row > div:nth-child(2) > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
    await page.getByTitle('Carro Care [SG]').locator('div').click();
    await page.locator('div:nth-child(5) > .ant-row > div:nth-child(2) > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
    await page.getByTitle('Fixed Amount').locator('div').click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('section').filter({ hasText: 'Live Days(7 Days)' }).getByRole('button').click();
    await page.getByRole('button', { name: 'star Save Filter' }).click();
    await page.getByPlaceholder('Filter name').click();
    await page.getByPlaceholder('Filter name').fill(filterName);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.locator('body')).toContainText(`Filter Created!The filter ${filterName} is saved.`);
})
