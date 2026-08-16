import { apiClient } from '@/shared/api/client';
import type { DashboardMetrics } from '@/shared/types/reporting';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get<DashboardMetrics>('/reports/dashboard');
  return data;
}
