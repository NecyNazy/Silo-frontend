import { apiClient } from '@/shared/api/client';
import type { CreateMemberInput, Member, RegisterMemberInput } from '@/shared/types/member';
import type { SessionTokens } from './store';

export interface LoginInput {
  email: string;
  password: string;
}

export async function login(input: LoginInput): Promise<SessionTokens> {
  const { data } = await apiClient.post<SessionTokens>('/auth/login', input);
  return data;
}

async function createMember(input: CreateMemberInput): Promise<Member> {
  const { data } = await apiClient.post<Member>('/members', input);
  return data;
}

async function registerCredentials(memberId: string, password: string): Promise<void> {
  await apiClient.post('/auth/register', { memberId, password });
}

export async function register(input: RegisterMemberInput): Promise<Member> {
  const member = await createMember({
    fullName: input.fullName,
    email: input.email,
    phoneNumber: input.phoneNumber,
  });
  await registerCredentials(member.id, input.password);
  return member;
}
