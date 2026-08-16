import { apiClient } from '@/shared/api/client';
import type {
  Contribution,
  ContributionSummary,
  RecordManualContributionInput,
} from '@/shared/types/contribution';

export async function getMemberContributions(memberId: string): Promise<Contribution[]> {
  const { data } = await apiClient.get<Contribution[]>(`/contributions/member/${memberId}`);
  return data;
}

export async function getContributionSummary(memberId: string): Promise<ContributionSummary> {
  const { data } = await apiClient.get<ContributionSummary>(
    `/contributions/member/${memberId}/summary`,
  );
  return data;
}

/** Gap-fill: the real backend has no "all contributions" endpoint yet. */
export async function listAllContributions(): Promise<Contribution[]> {
  const { data } = await apiClient.get<Contribution[]>('/contributions');
  return data;
}

export async function recordManualContribution(
  input: RecordManualContributionInput,
): Promise<Contribution> {
  const { data } = await apiClient.post<Contribution>('/contributions', input);
  return data;
}
