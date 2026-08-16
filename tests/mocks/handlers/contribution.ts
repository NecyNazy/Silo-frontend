import { http, HttpResponse } from 'msw';
import type { RecordManualContributionInput } from '@/shared/types/contribution';
import { contributions, members } from '../db';

function paged<T>(items: T[]) {
  return { content: items, totalElements: items.length, totalPages: 1, page: 0, size: items.length };
}

export const contributionHandlers = [
  http.get('/api/contributions', () => {
    return HttpResponse.json(paged([...contributions].reverse()));
  }),

  http.get('/api/contributions/member/:memberId', ({ params }) => {
    const results = contributions.filter((c) => c.memberId === params.memberId).reverse();
    return HttpResponse.json(paged(results));
  }),

  http.get('/api/contributions/member/:memberId/summary', ({ params }) => {
    const results = contributions.filter(
      (c) => c.memberId === params.memberId && c.status === 'CONFIRMED',
    );
    const totalContributed = results.reduce((sum, c) => sum + c.amount, 0);
    return HttpResponse.json({
      memberId: params.memberId,
      totalContributed,
      contributionCount: results.length,
      lastContributionAt: results.at(-1)?.createdAt,
    });
  }),

  http.post('/api/contributions', async ({ request }) => {
    const body = (await request.json()) as RecordManualContributionInput & { method?: string };
    const member = members.find((m) => m.id === body.memberId);

    const contribution = {
      id: `con-${contributions.length + 1}`,
      memberId: body.memberId,
      memberName: member?.fullName ?? 'Unknown member',
      amount: body.amount,
      method: (body.method as 'MANUAL' | 'PAYSTACK') ?? 'MANUAL',
      status: 'CONFIRMED' as const,
      reference: `manual-${contributions.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    contributions.push(contribution);

    return HttpResponse.json(contribution, { status: 201 });
  }),
];
