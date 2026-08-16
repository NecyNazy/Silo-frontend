import { apiClient } from '@/shared/api/client';
import type { DashboardMetrics, MemberReportSummary } from '@/shared/types/reporting';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get<DashboardMetrics>('/reports/dashboard');
  return data;
}

export async function getMemberReportSummary(memberId: string): Promise<MemberReportSummary> {
  const { data } = await apiClient.get<MemberReportSummary>(`/reports/members/${memberId}/summary`);
  return data;
}
