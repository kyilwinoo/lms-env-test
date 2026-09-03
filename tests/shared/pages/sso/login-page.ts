import { Page } from '@playwright/test'
import { config } from '~/config'

export class LoginPage {
  constructor(public readonly page: Page) { }

  async gotoSSOLoginPage() {
    await this.page.goto(config.domains.auth.sso.baseUrl)
  }

  async login(email: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Email' }).click()
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email)

    await this.page.getByRole('textbox', { name: 'Password' }).click()
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password)

    await this.page.getByRole('button', { name: 'Log in' }).first().click()

    await this.page.waitForURL(`${config.domains.auth.sso.baseUrl}/profile`)

  }
  async applicationLogin(applicationUrl: string) {
    await this.page.goto(applicationUrl)
    await this.page.getByRole('button', { name: 'Login with' }).click()
    await this.page.getByRole('main').nth(1).click()
    console.log('Login with SSO: ', applicationUrl)
    await this.page.waitForURL(applicationUrl+'/discount')
  }
}
