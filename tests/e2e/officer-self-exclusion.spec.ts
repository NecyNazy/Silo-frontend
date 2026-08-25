import { expect, test } from '@playwright/test';

const OFFICER_ID = 'seed-mem-1';

/**
 * TODO: this relied on the MSW gap-fill handler for GET /api/loan-requests
 * (removed now that the real endpoint is live) and a fake seeded session
 * for a member id that only existed in the mock fixtures. Rewrite against
 * real backend seed data: an OFFICER account with a genuine PENDING loan
 * request of their own, created via the real API before the test runs.
 */
test.skip('officer does not see their own pending loan request in the approval queue', async ({
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
