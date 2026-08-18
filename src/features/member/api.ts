import { apiClient } from '@/shared/api/client';
import type {
  KycDocumentUploadResponse,
  KycStatus,
  Member,
  MemberStatus,
  UpdateMemberProfileInput,
} from '@/shared/types/member';

export interface ListMembersParams {
  search?: string;
  kycStatus?: KycStatus;
}

export async function listMembers(params: ListMembersParams): Promise<Member[]> {
  const { data } = await apiClient.get<Member[]>('/members', { params });
  return data;
}

export async function getMember(id: string): Promise<Member> {
  const { data } = await apiClient.get<Member>(`/members/${id}`);
  return data;
}

export async function updateMemberProfile(
  id: string,
  input: UpdateMemberProfileInput,
): Promise<Member> {
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

export async function uploadKycDocument(
  id: string,
  file: File,
): Promise<KycDocumentUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<KycDocumentUploadResponse>(
    `/members/${id}/kyc-document`,
    formData,
  );
  return data;
}
