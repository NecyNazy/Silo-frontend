import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RecordManualContributionInput } from '@/shared/types/contribution';
import {
  getContributionSummary,
  getMemberContributions,
  listAllContributions,
  recordManualContribution,
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

export function useAllContributions(params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: ['contributions', 'all', params],
    queryFn: () => listAllContributions(params),
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
