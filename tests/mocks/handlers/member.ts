import { http, HttpResponse } from 'msw';
import type { KycStatus, MemberStatus, UpdateMemberInput } from '@/shared/types/member';
import { members } from '../db';

function paged<T>(items: T[]) {
  return { content: items, totalElements: items.length, totalPages: 1, page: 0, size: items.length };
}

export const memberHandlers = [
  http.get('/api/members', ({ request }) => {
    const url = new URL(request.url);
    const kycStatus = url.searchParams.get('kycStatus');
    const search = url.searchParams.get('search')?.toLowerCase();

    let results = members.filter((m) => m.role === 'MEMBER');
    if (kycStatus) results = results.filter((m) => m.kycStatus === kycStatus);
    if (search) {
      results = results.filter(
        (m) => m.fullName.toLowerCase().includes(search) || m.email.toLowerCase().includes(search),
      );
    }

    return HttpResponse.json(paged(results));
  }),

  http.get('/api/members/available-guarantors', () => {
    const candidates = members
      .filter((m) => m.role === 'MEMBER' && m.status === 'ACTIVE' && m.kycStatus === 'VERIFIED')
      .map((m) => ({ memberId: m.id, fullName: m.fullName, creditScore: m.creditScore }));
    return HttpResponse.json(candidates);
  }),

  http.get('/api/members/:id', ({ params }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) return HttpResponse.json({ message: 'Member not found' }, { status: 404 });
    return HttpResponse.json(member);
  }),

  http.put('/api/members/:id', async ({ params, request }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) return HttpResponse.json({ message: 'Member not found' }, { status: 404 });

    const body = (await request.json()) as UpdateMemberInput;
    Object.assign(member, body);
    return HttpResponse.json(member);
  }),

  http.patch('/api/members/:id/status', async ({ params, request }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) return HttpResponse.json({ message: 'Member not found' }, { status: 404 });

    const body = (await request.json()) as { status: MemberStatus };
    member.status = body.status;
    return HttpResponse.json(member);
  }),

  http.patch('/api/members/:id/kyc', async ({ params, request }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) return HttpResponse.json({ message: 'Member not found' }, { status: 404 });

    const body = (await request.json()) as { kycStatus: KycStatus };
    member.kycStatus = body.kycStatus;
    return HttpResponse.json(member);
  }),

  http.post('/api/members/:id/id-document', async ({ params }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) return HttpResponse.json({ message: 'Member not found' }, { status: 404 });

    member.idDocumentRef = `doc_${member.id}_${Date.now()}.upload`;
    return HttpResponse.json(member);
  }),
];
