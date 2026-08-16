import { http, HttpResponse } from 'msw';
import type { RegisterMemberInput } from '@/shared/types/member';
import { findMemberByEmail, members } from '../db';
import { issueMockToken } from '../jwt';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const member = findMemberByEmail(body.email);

    if (!member || !body.password) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    return HttpResponse.json({ token: issueMockToken(member) });
  }),

  http.post('/api/members', async ({ request }) => {
    const body = (await request.json()) as RegisterMemberInput;

    if (findMemberByEmail(body.email)) {
      return HttpResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const id = `mem-${members.length + 1}`;
    members.push({
      id,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      role: 'MEMBER',
      status: 'PENDING',
      kycStatus: 'PENDING',
      creditScore: 0,
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json({ id, status: 'PENDING', kycStatus: 'PENDING' }, { status: 201 });
  }),
];
