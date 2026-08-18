import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import type {
  RecordManualContributionInput,
  SetupAutoDebitInput,
  UpdateAutoDebitInput,
} from '@/shared/types/contribution';
import {
  getAutoDebitMandate,
  getContributionSummary,
  getMemberContributions,
  listAllContributions,
  recordManualContribution,
  setupAutoDebit,
  updateAutoDebit,
} from './api';

export function useMemberContributions(memberId: string | undefined) {
  return useQuery({
    queryKey: ['contributions', memberId],
    queryFn: () => getMemberContributions(memberId as string),
    enabled: Boolean(memberId),
  });
}

export function useContributionSummary(memberId: string | undefined) {
  return useQuery({
    queryKey: ['contributions', memberId, 'summary'],
    queryFn: () => getContributionSummary(memberId as string),
    enabled: Boolean(memberId),
  });
}

export function useAllContributions() {
  return useQuery({
    queryKey: ['contributions', 'all'],
    queryFn: () => listAllContributions(),
  });
}

export function useRecordManualContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecordManualContributionInput) => recordManualContribution(input),
    onSuccess: (contribution) => {
      queryClient.invalidateQueries({ queryKey: ['contributions', contribution.memberId] });
      queryClient.invalidateQueries({ queryKey: ['contributions', 'all'] });
    },
  });
}

export function useAutoDebitMandate() {
  const memberId = useAuthStore((s) => s.memberId);
  return useQuery({
    queryKey: ['contributions', 'auto-debit', memberId],
    queryFn: () => getAutoDebitMandate(),
    enabled: Boolean(memberId),
  });
}

export function useSetupAutoDebit() {
  const queryClient = useQueryClient();
  const memberId = useAuthStore((s) => s.memberId);
  return useMutation({
    mutationFn: (input: SetupAutoDebitInput) => setupAutoDebit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions', 'auto-debit', memberId] });
    },
  });
}

export function useUpdateAutoDebit() {
  const queryClient = useQueryClient();
  const memberId = useAuthStore((s) => s.memberId);
  return useMutation({
    mutationFn: (input: UpdateAutoDebitInput) => updateAutoDebit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions', 'auto-debit', memberId] });
    },
  });
}
