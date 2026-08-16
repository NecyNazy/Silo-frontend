import { expect, test } from '@playwright/test';

const MEMBER_ID = 'e2e-repay-member';
const LOAN_ID = 'e2e-loan-1';
const OUTSTANDING_BALANCE = 4200;

function envelope(data: unknown) {
  return { success: true, message: null, data, timestamp: new Date().toISOString() };
}

// This test only exercises a real (non-gap-mocked) endpoint, so the MSW
// service worker is unnecessary here. Blocking it keeps the single
// GET /api/loans/:id stub below the only thing intercepting the request.
test.use({ serviceWorkers: 'block' });

/**
 * The real backend rejects overpayment outright (422) rather than capping it,
 * so the repayment form must pre-fill and cap the amount input at the loan's
 * outstanding balance to avoid a guaranteed-fail round trip. Seeding an
 * authenticated MEMBER session directly isolates this test from the real
 * /auth/login endpoint.
 */
test('repayment amount is pre-filled and capped at the outstanding balance', async ({ page }) => {
  await page.addInitScript(
    ([storageKey, session]) => {
      window.sessionStorage.setItem(storageKey, session as string);
    },
    [
      'silo.session',
      JSON.stringify({
        accessToken: 'e2e-repay-access-token',
        refreshToken: 'e2e-repay-refresh-token',
        memberId: MEMBER_ID,
        role: 'MEMBER',
      }),
    ],
  );

  await page.route(`**/api/loans/${LOAN_ID}`, async (route) => {
    await route.fulfill({
      json: envelope({
        id: LOAN_ID,
        loanRequestId: 'e2e-loan-request-1',
        memberId: MEMBER_ID,
        principalAmount: 50_000,
        interestRate: 8,
        durationMonths: 6,
        disbursedDate: new Date().toISOString(),
        status: 'ACTIVE',
        outstandingBalance: OUTSTANDING_BALANCE,
        installments: [],
      }),
    });
  });

  await page.goto(`/loans/${LOAN_ID}/repay`);

  const amountInput = page.getByLabel('Amount (NGN)');
  await expect(amountInput).toHaveValue(String(OUTSTANDING_BALANCE));
  await expect(amountInput).toHaveAttribute('max', String(OUTSTANDING_BALANCE));

  await amountInput.fill(String(OUTSTANDING_BALANCE + 1000));
  await page.getByLabel('Reference').fill('overpay-attempt');
  await page.getByRole('button', { name: 'Submit repayment' }).click();

  await expect(page.getByText(/cannot exceed the outstanding balance/i)).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/loans/${LOAN_ID}/repay`));
});
