import { http, HttpResponse } from 'msw';
import type { CreateRepaymentInput } from '@/shared/types/repayment';
import { loans } from '../db';

export const repaymentHandlers = [
  http.post('/api/repayments', async ({ request }) => {
    const body = (await request.json()) as CreateRepaymentInput;
    const loan = loans.find((l) => l.id === body.loanId);
    if (!loan) return HttpResponse.json({ message: 'Loan not found' }, { status: 404 });

    let remaining = body.amount;
    for (const installment of loan.installments) {
      if (remaining <= 0) break;
      const owed = installment.amountDue - installment.amountPaid;
      if (owed <= 0) continue;

      const applied = Math.min(owed, remaining);
      installment.amountPaid += applied;
      remaining -= applied;
      if (installment.amountPaid >= installment.amountDue) {
        installment.status = 'PAID';
      }
    }

    loan.outstandingBalance = Math.max(0, loan.outstandingBalance - body.amount);
    if (loan.outstandingBalance === 0) {
      loan.status = 'CLOSED';
    }

    return HttpResponse.json(
      {
        id: `rep-${Date.now()}`,
        loanId: loan.id,
        type: 'INSTALLMENT',
        amount: body.amount,
        paidAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),
];
