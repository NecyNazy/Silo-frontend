import { http, HttpResponse } from 'msw';
import type {
  AddGuarantorInput,
  CreateLoanRequestInput,
  Guarantor,
  GuarantorInvite,
} from '@/shared/types/loan';
import { findGuarantorById, loanRequests, loans, members } from '../db';

function paged<T>(items: T[]) {
  return { content: items, totalElements: items.length, totalPages: 1, page: 0, size: items.length };
}

export const loanHandlers = [
  http.get('/api/loan-requests', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const mine = url.searchParams.get('mine');

    let results = [...loanRequests];
    if (status) results = results.filter((r) => r.status === status);
    if (mine === 'true') {
      const memberId = request.headers.get('x-mock-member-id');
      if (memberId) results = results.filter((r) => r.memberId === memberId);
    }

    return HttpResponse.json(paged(results.reverse()));
  }),

  http.get('/api/loan-requests/:id', ({ params }) => {
    const request = loanRequests.find((r) => r.id === params.id);
    if (!request) return HttpResponse.json({ message: 'Loan request not found' }, { status: 404 });
    return HttpResponse.json(request);
  }),

  http.post('/api/loan-requests', async ({ request }) => {
    const body = (await request.json()) as CreateLoanRequestInput;
    const memberId = request.headers.get('x-mock-member-id') ?? 'mem-1';
    const member = members.find((m) => m.id === memberId);

    const created = {
      id: `lr-${loanRequests.length + 1}`,
      memberId,
      memberName: member?.fullName ?? 'Unknown member',
      amount: body.amount,
      purpose: body.purpose,
      termMonths: body.termMonths,
      status: 'PENDING' as const,
      guarantors: [] as Guarantor[],
      createdAt: new Date().toISOString(),
    };
    loanRequests.push(created);

    return HttpResponse.json(created, { status: 201 });
  }),

  http.post('/api/loan-requests/:id/approve', ({ params }) => {
    const loanRequest = loanRequests.find((r) => r.id === params.id);
    if (!loanRequest) return HttpResponse.json({ message: 'Loan request not found' }, { status: 404 });

    loanRequest.status = 'APPROVED';
    loanRequest.decidedAt = new Date().toISOString();

    const member = members.find((m) => m.id === loanRequest.memberId);
    loans.push({
      id: `loan-${loans.length + 1}`,
      loanRequestId: loanRequest.id,
      memberId: loanRequest.memberId,
      memberName: member?.fullName ?? loanRequest.memberName,
      principal: loanRequest.amount,
      interestRate: 8,
      outstandingBalance: loanRequest.amount,
      status: 'ACTIVE',
      disbursedAt: new Date().toISOString(),
      guarantors: loanRequest.guarantors,
      installments: Array.from({ length: loanRequest.termMonths }).map((_, index) => ({
        id: `inst-${loanRequest.id}-${index + 1}`,
        loanId: `loan-${loans.length + 1}`,
        installmentNumber: index + 1,
        dueDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        amountDue: Math.round(loanRequest.amount / loanRequest.termMonths),
        amountPaid: 0,
        status: 'PENDING',
      })),
    });

    return HttpResponse.json(loanRequest);
  }),

  http.post('/api/loan-requests/:id/reject', async ({ params, request }) => {
    const loanRequest = loanRequests.find((r) => r.id === params.id);
    if (!loanRequest) return HttpResponse.json({ message: 'Loan request not found' }, { status: 404 });

    const body = (await request.json()) as { reason: string };
    loanRequest.status = 'REJECTED';
    loanRequest.decidedAt = new Date().toISOString();
    loanRequest.rejectionReason = body.reason;

    return HttpResponse.json(loanRequest);
  }),

  http.post('/api/loan-requests/:id/guarantors', async ({ params, request }) => {
    const loanRequest = loanRequests.find((r) => r.id === params.id);
    if (!loanRequest) return HttpResponse.json({ message: 'Loan request not found' }, { status: 404 });

    const body = (await request.json()) as AddGuarantorInput;
    const candidate = members.find((m) => m.id === body.guarantorMemberId);
    if (!candidate) return HttpResponse.json({ message: 'Member not found' }, { status: 404 });

    const guarantor: Guarantor = {
      id: `g-${Date.now()}`,
      loanRequestId: loanRequest.id,
      guarantorMemberId: candidate.id,
      guarantorName: candidate.fullName,
      guarantorCreditScore: candidate.creditScore,
      status: 'INVITED',
    };
    loanRequest.guarantors.push(guarantor);

    return HttpResponse.json(guarantor, { status: 201 });
  }),

  http.get('/api/members/:id/guarantor-invites', ({ params }) => {
    const invites: GuarantorInvite[] = loanRequests.flatMap((request) =>
      request.guarantors
        .filter((g) => g.guarantorMemberId === params.id)
        .map((g) => ({
          ...g,
          requesterMemberId: request.memberId,
          requesterName: request.memberName,
          requesterCreditScore: members.find((m) => m.id === request.memberId)?.creditScore ?? 0,
          requestedAmount: request.amount,
        })),
    );

    return HttpResponse.json(invites);
  }),

  http.post('/api/guarantors/:id/:action', ({ params }) => {
    const found = findGuarantorById(params.id as string);
    if (!found) return HttpResponse.json({ message: 'Guarantor entry not found' }, { status: 404 });

    const action = params.action as string;
    if (action !== 'accept' && action !== 'decline') {
      return HttpResponse.json({ message: 'Unknown action' }, { status: 400 });
    }

    found.guarantor.status = action === 'accept' ? 'ACCEPTED' : 'DECLINED';
    found.guarantor.respondedAt = new Date().toISOString();

    return HttpResponse.json(found.guarantor);
  }),

  http.get('/api/loans', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const mine = url.searchParams.get('mine');

    let results = [...loans];
    if (status) results = results.filter((l) => l.status === status);
    if (mine === 'true') {
      const memberId = request.headers.get('x-mock-member-id');
      if (memberId) results = results.filter((l) => l.memberId === memberId);
    }

    return HttpResponse.json(paged(results.reverse()));
  }),

  http.get('/api/loans/:id', ({ params }) => {
    const loan = loans.find((l) => l.id === params.id);
    if (!loan) return HttpResponse.json({ message: 'Loan not found' }, { status: 404 });
    return HttpResponse.json(loan);
  }),

  http.get('/api/loans/:id/guarantor-liabilities', () => {
    return HttpResponse.json([]);
  }),
];
