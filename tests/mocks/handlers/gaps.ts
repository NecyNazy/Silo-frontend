import { http, HttpResponse } from 'msw';
import { contributions, loanRequests, loans, members } from '../db';

function ok<T>(data: T) {
  return HttpResponse.json({ success: true, message: null, data, timestamp: new Date().toISOString() });
}

function notFound(path: string, message: string) {
  return HttpResponse.json(
    { timestamp: new Date().toISOString(), status: 404, error: 'Not Found', message, path, errors: [] },
    { status: 404 },
  );
}

/**
 * Stands in for the handful of GET endpoints the real backend doesn't expose
 * yet: list members, list/get loan requests (and their guarantors, which
 * have no real endpoint at all), and list loans. Every other request is
 * bypassed and hits the real backend, see main.tsx / shared/api/client.ts.
 */
export const gapHandlers = [
  http.get('/api/members', ({ request }) => {
    const url = new URL(request.url);
    const kycStatus = url.searchParams.get('kycStatus');
    const search = url.searchParams.get('search')?.toLowerCase();

    let results = members;
    if (kycStatus) results = results.filter((m) => m.kycStatus === kycStatus);
    if (search) {
      results = results.filter(
        (m) => m.fullName.toLowerCase().includes(search) || m.email.toLowerCase().includes(search),
      );
    }

    return ok(results);
  }),

  http.get('/api/contributions', () => {
    return ok([...contributions].reverse());
  }),

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

    return ok(results.reverse());
  }),

  http.get('/api/loan-requests/:id', ({ params }) => {
    const loanRequest = loanRequests.find((r) => r.id === params.id);
    if (!loanRequest) {
      return notFound(`/api/loan-requests/${params.id}`, 'Loan request not found');
    }
    return ok(loanRequest);
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

    return ok(results.reverse());
  }),
];
