// login.ts
import { Page, expect } from '@playwright/test';
const envs = process.env.ENVIRONMENT || "STG";

let baseUrl: string | undefined;
let email: string | undefined;
let password: string | undefined;

if (envs === 'STG') {
    baseUrl = process.env.STG_APP_DOMAIN;
    email = process.env.STG_EMAIL;
    password = process.env.STG_PASSWORD;
} else if (envs === 'UAT') {
    baseUrl = process.env.UAT_APP_DOMAIN;
    email = process.env.UAT_EMAIL;
    password = process.env.UAT_PASSWORD;
} else {
    throw new Error('Please provide valid ENVIRONMENT variables');
}
if (!envs || !baseUrl || !email || !password) {
    throw new Error(`error`)
}
export async function login(page: Page): Promise<void> {
    // Go to the login page
    // await page.goto(`${baseUrl}/login`)
    await page.goto(baseUrl as string);
    const btnLoginSSO = await page.getByRole('button', { name: 'Login with carro_sso_logo_icon' });
    await btnLoginSSO.waitFor();
    await btnLoginSSO.click();
    // Fill in the username and password fields
    const txtEmail = await page.locator('input[name="email"]');
    await txtEmail.waitFor();
    await txtEmail.fill(email as string);
    const txtPwd = await page.locator('input[name="password"]');
    await txtPwd.waitFor();
    await txtPwd.fill(password as string);
    // Submit the login 
    const btnSubmit = page.locator('button[type="submit"][name="login"]');
    await btnSubmit.waitFor();
    await btnSubmit.click();

    console.log('Login successful: ', baseUrl);
    // Verify the disocunt URL after login
    await page.waitForURL(baseUrl + '/discount');
    await expect(page).toHaveURL(baseUrl + '/discount');
}
