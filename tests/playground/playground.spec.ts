import { test as setup, expect } from '@playwright/test'
import { config } from '~/config'
import { STORAGE_STATE } from '@/playwright.config'
import { LoginPage } from '@pages/sso/login-page'
import fs from 'fs'
import { Discounts } from '../page-objects/discount-page';
import { VoucherActions } from '../page-objects/voucher-page';

let discountCreation: Discounts;
let voucherActions: VoucherActions;

setup('SSO authentication', async ({ page }) => {
    if (fs.existsSync(STORAGE_STATE)) {
        return
    }
    const ssoLoginPage = new LoginPage(page)
    await ssoLoginPage.gotoSSOLoginPage()
    await ssoLoginPage.login(config.credentials.auth.sso.username, config.credentials.auth.sso.password)
    await ssoLoginPage.page.context().storageState({ path: STORAGE_STATE })
    discountCreation = new Discounts(page, "CREATE");
    await discountCreation.clickDiscountById("00222");
})
