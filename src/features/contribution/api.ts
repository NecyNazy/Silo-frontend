import { apiClient } from '@/shared/api/client';
import type {
  AutoDebitMandate,
  Contribution,
  ContributionSummary,
  RecordManualContributionInput,
  SetupAutoDebitInput,
  UpdateAutoDebitInput,
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

export async function getAutoDebitMandate(): Promise<AutoDebitMandate | null> {
  const response = await apiClient.get<AutoDebitMandate | ''>('/contributions/auto-debit', {
    validateStatus: (status) => status === 200 || status === 204,
  });
  return response.status === 204 || !response.data ? null : response.data;
}

export async function setupAutoDebit(input: SetupAutoDebitInput): Promise<AutoDebitMandate> {
  const { data } = await apiClient.post<AutoDebitMandate>('/contributions/auto-debit', input);
  return data;
}

export async function updateAutoDebit(input: UpdateAutoDebitInput): Promise<AutoDebitMandate> {
  const { data } = await apiClient.patch<AutoDebitMandate>('/contributions/auto-debit', input);
  return data;
}
