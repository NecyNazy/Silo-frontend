import { apiClient } from '@/shared/api/client';
import type { PageResponse } from '@/shared/types/api';
import type {
  Contribution,
  ContributionSummary,
  RecordManualContributionInput,
} from '@/shared/types/contribution';

export async function getMemberContributions(
  memberId: string,
): Promise<PageResponse<Contribution>> {
  const { data } = await apiClient.get<PageResponse<Contribution>>(
    `/contributions/member/${memberId}`,
  );
  return data;
}

export async function getContributionSummary(memberId: string): Promise<ContributionSummary> {
  const { data } = await apiClient.get<ContributionSummary>(
    `/contributions/member/${memberId}/summary`,
  );
  return data;
}

export async function listAllContributions(params: {
  page?: number;
  size?: number;
}): Promise<PageResponse<Contribution>> {
  const { data } = await apiClient.get<PageResponse<Contribution>>('/contributions', { params });
  return data;
}

export async function recordManualContribution(
  input: RecordManualContributionInput,
): Promise<Contribution> {
  const { data } = await apiClient.post<Contribution>('/contributions', {
    ...input,
    method: 'MANUAL',
  });
  return data;
}
