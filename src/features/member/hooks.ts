import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import type { KycStatus, MemberStatus, UpdateMemberProfileInput } from '@/shared/types/member';
import {
  getMember,
  listMembers,
  updateKycStatus,
  updateMemberProfile,
  updateMemberStatus,
  type ListMembersParams,
} from './api';

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => getMember(id as string),
    enabled: Boolean(id),
  });
}

export function useMyProfile() {
  const memberId = useAuthStore((s) => s.memberId);
  return useMember(memberId ?? undefined);
}

export function useMembers(params: ListMembersParams = {}) {
  return useQuery({
    queryKey: ['members', 'list', params],
    queryFn: () => listMembers(params),
  });
}

export function useUpdateMemberProfile(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMemberProfileInput) => updateMemberProfile(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', id] });
    },
  });
}

export function useUpdateMemberStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: MemberStatus) => updateMemberStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', id] });
      queryClient.invalidateQueries({ queryKey: ['members', 'list'] });
    },
  });
}

export function useUpdateKycStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (kycStatus: KycStatus) => updateKycStatus(id, kycStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', id] });
      queryClient.invalidateQueries({ queryKey: ['members', 'list'] });
    },
  });
}
