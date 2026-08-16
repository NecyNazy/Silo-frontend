import { expect, test } from '@playwright/test';

test('register then sign in lands on the member dashboard', async ({ page }) => {
  await page.goto('/register');

  const uniqueEmail = `new-member-${Date.now()}@silo.dev`;
  await page.getByLabel('Full name').fill('Test Member');
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Phone').fill('+2348099999999');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/account created/i)).toBeVisible();

  await page.getByLabel('Email').fill('member@silo.dev');
  await page.getByLabel('Password').fill('anything');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/welcome back/i)).toBeVisible();
});
