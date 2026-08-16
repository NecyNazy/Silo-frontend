import { apiClient } from '@/shared/api/client';
import type { RegisterMemberInput } from '@/shared/types/member';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', input);
  return data;
}

export interface RegisterResponse {
  id: string;
  status: string;
  kycStatus: string;
}

export async function register(input: RegisterMemberInput): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/members', input);
  return data;
}
