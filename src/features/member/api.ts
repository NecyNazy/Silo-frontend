import { apiClient } from '@/shared/api/client';
import type { PageResponse } from '@/shared/types/api';
import type { KycStatus, Member, MemberStatus, UpdateMemberInput } from '@/shared/types/member';

export interface ListMembersParams {
  search?: string;
  kycStatus?: KycStatus;
  page?: number;
  size?: number;
}

export async function listMembers(params: ListMembersParams): Promise<PageResponse<Member>> {
  const { data } = await apiClient.get<PageResponse<Member>>('/members', { params });
  return data;
}

export async function getMember(id: string): Promise<Member> {
  const { data } = await apiClient.get<Member>(`/members/${id}`);
  return data;
}

export async function updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
  const { data } = await apiClient.put<Member>(`/members/${id}`, input);
  return data;
}

export async function updateMemberStatus(id: string, status: MemberStatus): Promise<Member> {
  const { data } = await apiClient.patch<Member>(`/members/${id}/status`, { status });
  return data;
}

export async function updateKycStatus(id: string, kycStatus: KycStatus): Promise<Member> {
  const { data } = await apiClient.patch<Member>(`/members/${id}/kyc`, { kycStatus });
  return data;
}

export async function uploadIdDocument(id: string, file: File): Promise<Member> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.post<Member>(`/members/${id}/id-document`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
