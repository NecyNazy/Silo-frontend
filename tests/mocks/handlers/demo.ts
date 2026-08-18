import { http, HttpResponse, passthrough } from 'msw';
import type { AutoDebitPeriodicity } from '@/shared/types/contribution';
import type { Member } from '@/shared/types/member';
import {
  autoDebitMandates,
  contributions,
  createDemoMandate,
  demoAccounts,
  installmentsByLoanId,
  loanRequests,
  loans,
  members,
  notifications,
  officerApplications,
  type DemoOfficerApplication,
} from '../db';

const REQUIRED_OFFICER_APPROVALS = 1;

function toOfficerApplicationResponse(application: DemoOfficerApplication, caller: string | null) {
  return {
    id: application.id,
    memberId: application.memberId,
    status: application.status,
    approvalCount: application.approvedByMemberIds.length,
    approvedByCaller: caller ? application.approvedByMemberIds.includes(caller) : false,
    createdAt: application.createdAt,
    decidedAt: application.decidedAt,
  };
}

/**
 * Local-preview-only handlers so the redesigned UI can be clicked through
 * with `npm run dev` and no backend running. Every handler here is
 * conditional: it only serves demo data when the request is clearly about
 * one of the seed accounts (a `seed-mem-*`/`seed-loan-*`/... id, or demo
 * login credentials). Anything else calls `passthrough()` so a real backend,
 * when one is running, still handles real accounts exactly as before - this
 * file never hijacks a real request.
 *
 * Demo credentials: seed-member@silo.dev / seed-officer@silo.dev, both
 * password123 (see LoginScreen's "Try a demo account" section, dev only).
 */

function ok<T>(data: T, message: string | null = null) {
  return HttpResponse.json({ success: true, message, data, timestamp: new Date().toISOString() });
}

function notFound(path: string, message: string) {
  return HttpResponse.json(
    { timestamp: new Date().toISOString(), status: 404, error: 'Not Found', message, path, errors: [] },
    { status: 404 },
  );
}

function unauthorized(path: string, message: string) {
  return HttpResponse.json(
    { timestamp: new Date().toISOString(), status: 401, error: 'Unauthorized', message, path },
    { status: 401 },
  );
}

function unprocessable(path: string, message: string) {
  return HttpResponse.json(
    { timestamp: new Date().toISOString(), status: 422, error: 'Unprocessable Entity', message, path, errors: [] },
    { status: 422 },
  );
}

function isDemoId(id: string | undefined | null): boolean {
  return typeof id === 'string' && id.startsWith('seed-');
}

function callerId(request: Request): string | null {
  return request.headers.get('x-mock-member-id');
}

function findMember(id: string | undefined): Member | undefined {
  return members.find((m) => m.id === id);
}

let nextId = 1000;
function newId(prefix: string): string {
  nextId += 1;
  return `seed-${prefix}-${nextId}`;
}

export const demoHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    const account = demoAccounts.find((a) => a.email === body.email && a.password === body.password);
    if (!account) return passthrough();

    return ok({
      accessToken: `demo-access-${account.memberId}`,
      refreshToken: `demo-refresh-${account.memberId}`,
      memberId: account.memberId,
      role: account.role,
    });
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refreshToken?: string };
    const account = demoAccounts.find((a) => body.refreshToken === `demo-refresh-${a.memberId}`);
    if (!account) return passthrough();

    return ok({
      accessToken: `demo-access-${account.memberId}`,
      refreshToken: `demo-refresh-${account.memberId}`,
      memberId: account.memberId,
      role: account.role,
    });
  }),

  http.get('/api/members/available-guarantors', ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    return ok(
      members
        .filter((m) => m.id !== caller)
        .map((m) => ({ memberId: m.id, email: m.email, credibilityScore: 78 })),
    );
  }),

  http.get('/api/members/:id/guarantor-invites', ({ params }) => {
    const memberId = params.id as string;
    if (!isDemoId(memberId)) return passthrough();

    const invites = loanRequests
      .flatMap((request) =>
        request.guarantors
          .filter((g) => g.memberId === memberId && g.status === 'PENDING')
          .map((g) => ({
            id: g.id,
            loanRequestId: request.id,
            borrowerMemberId: request.memberId,
            amountRequested: request.amountRequested,
            purpose: request.purpose,
            borrowerRiskTier: 'MEDIUM' as const,
            invitedAt: g.invitedAt,
          })),
      );

    return ok(invites);
  }),

  http.post('/api/guarantors/:id/:action', ({ params }) => {
    const { id, action } = params as { id: string; action: string };
    if (!isDemoId(id) || (action !== 'accept' && action !== 'decline')) return passthrough();

    for (const request of loanRequests) {
      const guarantor = request.guarantors.find((g) => g.id === id);
      if (guarantor) {
        guarantor.status = action === 'accept' ? 'ACCEPTED' : 'DECLINED';
        return ok(guarantor);
      }
    }
    return notFound(`/api/guarantors/${id}/${action}`, 'Guarantor invite not found');
  }),

  http.get('/api/members/:id', ({ params }) => {
    const id = params.id as string;
    if (!isDemoId(id)) return passthrough();

    const member = findMember(id);
    if (!member) return notFound(`/api/members/${id}`, 'Member not found');
    return ok(member);
  }),

  http.put('/api/members/:id', async ({ params, request }) => {
    const id = params.id as string;
    if (!isDemoId(id)) return passthrough();

    const member = findMember(id);
    if (!member) return notFound(`/api/members/${id}`, 'Member not found');

    const body = (await request.json()) as Partial<Member>;
    Object.assign(member, body);
    return ok(member, 'Profile updated');
  }),

  http.patch('/api/members/:id/status', async ({ params, request }) => {
    const id = params.id as string;
    if (!isDemoId(id)) return passthrough();

    const caller = callerId(request);
    if (caller === id) return unprocessable(`/api/members/${id}/status`, 'An officer cannot change their own status');

    const member = findMember(id);
    if (!member) return notFound(`/api/members/${id}/status`, 'Member not found');

    const body = (await request.json()) as { status: Member['status'] };
    member.status = body.status;
    return ok(member, 'Status updated');
  }),

  http.patch('/api/members/:id/kyc', async ({ params, request }) => {
    const id = params.id as string;
    if (!isDemoId(id)) return passthrough();

    const caller = callerId(request);
    if (caller === id) return unprocessable(`/api/members/${id}/kyc`, 'An officer cannot change their own KYC status');

    const member = findMember(id);
    if (!member) return notFound(`/api/members/${id}/kyc`, 'Member not found');

    const body = (await request.json()) as { kycStatus: Member['kycStatus'] };
    member.kycStatus = body.kycStatus;
    return ok(member, 'KYC status updated');
  }),

  http.get('/api/contributions/member/:memberId', ({ params }) => {
    const memberId = params.memberId as string;
    if (!isDemoId(memberId)) return passthrough();

    return ok(contributions.filter((c) => c.memberId === memberId).reverse());
  }),

  http.get('/api/contributions/member/:memberId/summary', ({ params }) => {
    const memberId = params.memberId as string;
    if (!isDemoId(memberId)) return passthrough();

    const own = contributions.filter((c) => c.memberId === memberId);
    return ok({
      memberId,
      totalAmount: own.reduce((sum, c) => sum + c.amount, 0),
      contributionCount: own.length,
    });
  }),

  http.post('/api/contributions', async ({ request }) => {
    const body = (await request.json()) as { memberId: string; amount: number; reference: string };
    if (!isDemoId(body.memberId)) return passthrough();

    const caller = callerId(request);
    if (caller === body.memberId) {
      return unprocessable('/api/contributions', 'An officer cannot record their own contribution');
    }

    const contribution = {
      id: newId('con'),
      memberId: body.memberId,
      amount: body.amount,
      reference: body.reference,
      source: 'MANUAL' as const,
      recordedBy: caller,
      contributionDate: new Date().toISOString(),
    };
    contributions.push(contribution);
    return ok(contribution, 'Contribution recorded successfully');
  }),

  http.get('/api/loans/:id', ({ params }) => {
    const id = params.id as string;
    if (!isDemoId(id)) return passthrough();

    const loan = loans.find((l) => l.id === id);
    if (!loan) return notFound(`/api/loans/${id}`, 'Loan not found');
    return ok({ ...loan, installments: installmentsByLoanId[id] ?? [] });
  }),

  http.post('/api/loan-requests', async ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    const body = (await request.json()) as { amountRequested: number; purpose: string };
    const loanRequest = {
      id: newId('lr'),
      memberId: caller as string,
      amountRequested: body.amountRequested,
      purpose: body.purpose,
      status: 'PENDING' as const,
      submittedAt: new Date().toISOString(),
      guarantors: [],
    };
    loanRequests.unshift(loanRequest);
    return ok(loanRequest, 'Loan request submitted');
  }),

  http.post('/api/loan-requests/:id/guarantors', async ({ params, request }) => {
    const id = params.id as string;
    if (!isDemoId(id)) return passthrough();

    const loanRequest = loanRequests.find((r) => r.id === id);
    if (!loanRequest) return notFound(`/api/loan-requests/${id}/guarantors`, 'Loan request not found');

    const body = (await request.json()) as { guarantorMemberId: string };
    const guarantor = {
      id: newId('g'),
      loanRequestId: id,
      memberId: body.guarantorMemberId,
      status: 'PENDING' as const,
      invitedAt: new Date().toISOString(),
    };
    loanRequest.guarantors.push(guarantor);
    return ok(guarantor, 'Guarantor invited');
  }),

  http.post('/api/loan-requests/:id/:decision', ({ params, request }) => {
    const { id, decision } = params as { id: string; decision: string };
    if (!isDemoId(id) || (decision !== 'approve' && decision !== 'reject')) return passthrough();

    const loanRequest = loanRequests.find((r) => r.id === id);
    if (!loanRequest) return notFound(`/api/loan-requests/${id}/${decision}`, 'Loan request not found');

    const caller = callerId(request);
    if (caller === loanRequest.memberId) {
      return unprocessable(
        `/api/loan-requests/${id}/${decision}`,
        `An officer cannot ${decision} their own loan request`,
      );
    }

    if (decision === 'reject') {
      loanRequest.status = 'REJECTED';
      return ok(loanRequest, 'Loan request rejected');
    }

    loanRequest.status = 'APPROVED';
    const loan = {
      id: newId('loan'),
      loanRequestId: loanRequest.id,
      memberId: loanRequest.memberId,
      principalAmount: loanRequest.amountRequested,
      interestRate: 8,
      durationMonths: 6,
      disbursedDate: new Date().toISOString(),
      status: 'ACTIVE' as const,
      outstandingBalance: loanRequest.amountRequested,
    };
    loans.unshift(loan);
    return ok(loan, 'Loan request approved');
  }),

  http.get('/api/notifications/member/:memberId', ({ params }) => {
    const memberId = params.memberId as string;
    if (!isDemoId(memberId)) return passthrough();

    return ok(notifications.filter((n) => n.memberId === memberId));
  }),

  http.get('/api/reports/dashboard', ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
    const outstandingBalance = loans.reduce((sum, l) => sum + l.outstandingBalance, 0);
    return ok({
      activeLoans: loans.filter((l) => l.status === 'ACTIVE').length,
      totalContributions,
      outstandingBalance,
      defaultRate: loans.length
        ? (loans.filter((l) => l.status === 'DEFAULTED').length / loans.length) * 100
        : 0,
    });
  }),

  http.get('/api/reports/members/:id/summary', ({ params }) => {
    const memberId = params.id as string;
    if (!isDemoId(memberId)) return passthrough();

    const own = contributions.filter((c) => c.memberId === memberId);
    return ok({
      memberId,
      totalContributions: own.reduce((sum, c) => sum + c.amount, 0),
      activeLoans: loans.filter((l) => l.memberId === memberId && l.status === 'ACTIVE').length,
      totalRepayments: loans
        .filter((l) => l.memberId === memberId)
        .reduce((sum, l) => sum + (l.principalAmount - l.outstandingBalance), 0),
    });
  }),

  http.post('/api/repayments', async ({ request }) => {
    const body = (await request.json()) as { loanId: string; amount: number; reference: string };
    if (!isDemoId(body.loanId)) return passthrough();

    const loan = loans.find((l) => l.id === body.loanId);
    if (!loan) return notFound('/api/repayments', 'Loan not found');
    if (body.amount > loan.outstandingBalance) {
      return unprocessable('/api/repayments', "Repayment amount exceeds the loan's outstanding balance");
    }

    loan.outstandingBalance -= body.amount;
    if (loan.outstandingBalance <= 0) {
      loan.outstandingBalance = 0;
      loan.status = 'CLOSED';
    }

    const caller = callerId(request);
    if (!caller) return unauthorized('/api/repayments', 'Not authenticated');

    const repayment = {
      id: newId('rep'),
      loanId: loan.id,
      payerMemberId: caller,
      liabilityId: null,
      amount: body.amount,
      reference: body.reference,
      paymentDate: new Date().toISOString(),
    };
    return ok(repayment, 'Repayment recorded');
  }),

  http.post('/api/members/:id/kyc-document', async ({ params, request }) => {
    const id = params.id as string;
    if (!isDemoId(id)) return passthrough();

    const member = findMember(id);
    if (!member) return notFound(`/api/members/${id}/kyc-document`, 'Member not found');

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return unprocessable(`/api/members/${id}/kyc-document`, 'No file uploaded');
    }

    // A real upload, held only in the tab's memory via an object URL. Good
    // enough to preview locally; it won't survive a reload or another tab.
    member.idDocumentRef = URL.createObjectURL(file);

    // Fabricated OCR result so the "use these details" flow is demoable
    // locally. A real backend call to Vision would extract this for real.
    const extracted =
      file.type.startsWith('image/') || file.type === 'application/pdf'
        ? {
            idType: 'National ID' as const,
            idNumber: `NIN-${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
            confidence: 0.91,
          }
        : null;

    return ok({ member, extracted }, 'KYC document uploaded');
  }),

  http.post('/api/officer-applications', ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    const existing = officerApplications.find(
      (a) => a.memberId === caller && a.status === 'PENDING',
    );
    if (existing) return ok(toOfficerApplicationResponse(existing, caller));

    const application: DemoOfficerApplication = {
      id: newId('oa'),
      memberId: caller as string,
      status: 'PENDING',
      approvedByMemberIds: [],
      createdAt: new Date().toISOString(),
      decidedAt: null,
    };
    officerApplications.push(application);
    return ok(toOfficerApplicationResponse(application, caller), 'Application submitted');
  }),

  http.get('/api/officer-applications/me', ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    return ok(
      officerApplications
        .filter((a) => a.memberId === caller)
        .map((a) => toOfficerApplicationResponse(a, caller)),
    );
  }),

  http.get('/api/officer-applications/pending', ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    return ok(
      officerApplications
        .filter((a) => a.status === 'PENDING' && a.memberId !== caller)
        .map((a) => toOfficerApplicationResponse(a, caller)),
    );
  }),

  http.post('/api/officer-applications/:id/:decision', ({ params, request }) => {
    const { id, decision } = params as { id: string; decision: string };
    if (!isDemoId(id) || (decision !== 'approve' && decision !== 'reject')) return passthrough();

    const application = officerApplications.find((a) => a.id === id);
    if (!application) {
      return notFound(`/api/officer-applications/${id}/${decision}`, 'Application not found');
    }

    const caller = callerId(request);
    if (caller === application.memberId) {
      return unprocessable(
        `/api/officer-applications/${id}/${decision}`,
        `An officer cannot ${decision} their own application`,
      );
    }
    if (decision === 'approve' && caller && application.approvedByMemberIds.includes(caller)) {
      return unprocessable(
        `/api/officer-applications/${id}/approve`,
        'You have already approved this application',
      );
    }

    if (decision === 'reject') {
      application.status = 'REJECTED';
      application.decidedAt = new Date().toISOString();
      return ok(toOfficerApplicationResponse(application, caller), 'Application rejected');
    }

    if (caller) application.approvedByMemberIds.push(caller);
    if (application.approvedByMemberIds.length >= REQUIRED_OFFICER_APPROVALS) {
      application.status = 'APPROVED';
      application.decidedAt = new Date().toISOString();
    }
    return ok(toOfficerApplicationResponse(application, caller), 'Approval recorded');
  }),

  http.get('/api/contributions/auto-debit', ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    const mandate = caller ? autoDebitMandates[caller] : undefined;
    if (!mandate) return new HttpResponse(null, { status: 204 });
    return ok(mandate);
  }),

  http.post('/api/contributions/auto-debit', async ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    const body = (await request.json()) as {
      amount: number;
      periodicity: AutoDebitPeriodicity;
      reference?: string;
    };
    const mandate = createDemoMandate(caller as string, body.amount, body.periodicity);
    return ok(mandate, 'Auto-debit set up');
  }),

  http.patch('/api/contributions/auto-debit', async ({ request }) => {
    const caller = callerId(request);
    if (!isDemoId(caller)) return passthrough();

    const mandate = caller ? autoDebitMandates[caller] : undefined;
    if (!mandate) return notFound('/api/contributions/auto-debit', 'No auto-debit mandate found');

    const body = (await request.json()) as {
      amount?: number;
      periodicity?: AutoDebitPeriodicity;
      status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    };
    if (body.amount !== undefined) mandate.amount = body.amount;
    if (body.periodicity !== undefined) mandate.periodicity = body.periodicity;
    if (body.status !== undefined) mandate.status = body.status;
    return ok(mandate, 'Auto-debit updated');
  }),
];
