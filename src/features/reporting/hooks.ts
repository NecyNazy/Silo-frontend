import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics, getMemberReportSummary } from './api';

const POLL_INTERVAL_MS = 15_000;

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: () => getDashboardMetrics(),
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}

export function useMemberReportSummary(memberId: string | undefined) {
  return useQuery({
    queryKey: ['reports', 'members', memberId, 'summary'],
    queryFn: () => getMemberReportSummary(memberId as string),
    enabled: Boolean(memberId),
  });
}
