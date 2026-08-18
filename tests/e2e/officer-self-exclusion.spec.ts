import { expect, test } from '@playwright/test';

const OFFICER_ID = 'seed-mem-1';

/**
 * seed-mem-1 (see tests/mocks/db.ts) owns the only PENDING loan request in
 * the gap-fill seed data. Seeding an authenticated OFFICER session directly
 * (rather than driving the login form) isolates this test from the real
 * /auth/login endpoint entirely, so it only depends on the MSW gap-fill
 * handler for /api/loan-requests. It verifies the admin queue excludes an
 * officer's own pending request rather than showing them a doomed
 * approve/reject action on themselves.
 */
test('officer does not see their own pending loan request in the approval queue', async ({
  page,
}) => {
  await page.addInitScript(
    ([storageKey, session]) => {
      window.sessionStorage.setItem(storageKey, session as string);
    },
    [
      'silo.session',
      JSON.stringify({
        accessToken: 'e2e-officer-access-token',
        refreshToken: 'e2e-officer-refresh-token',
        memberId: OFFICER_ID,
        role: 'OFFICER',
      }),
    ],
  );

  await page.goto('/admin/loan-requests');

  await expect(page.getByText('No pending loan requests')).toBeVisible();
});
