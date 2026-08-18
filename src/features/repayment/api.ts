import { apiClient } from '@/shared/api/client';
import type {
  CreateLiabilityRepaymentInput,
  CreateRepaymentInput,
  Repayment,
} from '@/shared/types/repayment';

export async function createRepayment(input: CreateRepaymentInput): Promise<Repayment> {
  const { data } = await apiClient.post<Repayment>('/repayments', input);
  return data;
}

export async function createLiabilityRepayment(
  input: CreateLiabilityRepaymentInput,
): Promise<Repayment> {
  const { data } = await apiClient.post<Repayment>('/repayments/liability', input);
  return data;
}
