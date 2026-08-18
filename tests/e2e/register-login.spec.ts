import { expect, test } from '@playwright/test';

const MEMBER_ID = 'e2e-member-id';

function envelope(data: unknown) {
  return { success: true, message: null, data, timestamp: new Date().toISOString() };
}

/**
 * The preview server this test runs against has no dev proxy to a real
 * backend, so the handful of real (non-gap-mocked) endpoints this golden
 * path touches are stubbed here directly — independent of both a live
 * backend and the MSW gap-fill handlers, which still run for everything else.
 */
test('register then sign in lands on the member dashboard', async ({ page }) => {
  const uniqueEmail = `new-member-${Date.now()}@silo.dev`;

  await page.route('**/api/members', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    await route.fulfill({
      json: envelope({
        id: MEMBER_ID,
        fullName: 'Test Member',
        email: uniqueEmail,
        phoneNumber: '+2348099999999',
        kycStatus: 'PENDING',
        status: 'ACTIVE',
        joinedDate: new Date().toISOString(),
      }),
    });
  });

  await page.route('**/api/auth/register', async (route) => {
    await route.fulfill({ json: envelope(null) });
  });

  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      json: envelope({
        accessToken: 'e2e-access-token',
        refreshToken: 'e2e-refresh-token',
        memberId: MEMBER_ID,
        role: 'MEMBER',
      }),
    });
  });

  await page.route(`**/api/members/${MEMBER_ID}`, async (route) => {
    await route.fulfill({
      json: envelope({
        id: MEMBER_ID,
        fullName: 'Test Member',
        email: uniqueEmail,
        phoneNumber: '+2348099999999',
        kycStatus: 'PENDING',
        status: 'ACTIVE',
        joinedDate: new Date().toISOString(),
      }),
    });
  });

  await page.route(`**/api/reports/members/${MEMBER_ID}/summary`, async (route) => {
    await route.fulfill({
      json: envelope({ memberId: MEMBER_ID, totalContributions: 0, activeLoans: 0, totalRepayments: 0 }),
    });
  });

  await page.goto('/register');
  await page.getByLabel('Full name').fill('Test Member');
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Phone').fill('+2348099999999');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/account created/i)).toBeVisible();

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/welcome back/i)).toBeVisible();
});
