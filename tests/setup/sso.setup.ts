import { test as setup } from '@playwright/test'
import { config } from '~/config'
import { STORAGE_STATE } from '@/playwright.config'
import { LoginPage } from '@pages/sso/login-page'
import fs from 'fs'

setup('SSO authentication', async ({ page }) => {
  if (fs.existsSync(STORAGE_STATE)) {
    return
  }
  const ssoLoginPage = new LoginPage(page)
  await ssoLoginPage.gotoSSOLoginPage()
  await ssoLoginPage.login(config.credentials.auth.sso.username, config.credentials.auth.sso.password)
  await ssoLoginPage.page.context().storageState({ path: STORAGE_STATE })
})
