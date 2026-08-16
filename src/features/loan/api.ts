import { apiClient } from '@/shared/api/client';
import type { PageResponse } from '@/shared/types/api';
import type {
  AddGuarantorInput,
  AvailableGuarantor,
  CreateLoanRequestInput,
  Guarantor,
  GuarantorInvite,
  GuarantorLiability,
  Loan,
  LoanRequest,
  LoanRequestStatus,
  LoanStatus,
} from '@/shared/types/loan';

export interface ListLoanRequestsParams {
  status?: LoanRequestStatus;
  mine?: boolean;
  page?: number;
  size?: number;
}

export async function listLoanRequests(
  params: ListLoanRequestsParams,
): Promise<PageResponse<LoanRequest>> {
  const { data } = await apiClient.get<PageResponse<LoanRequest>>('/loan-requests', { params });
  return data;
}

export async function getLoanRequest(id: string): Promise<LoanRequest> {
  const { data } = await apiClient.get<LoanRequest>(`/loan-requests/${id}`);
  return data;
}

export async function createLoanRequest(input: CreateLoanRequestInput): Promise<LoanRequest> {
  const { data } = await apiClient.post<LoanRequest>('/loan-requests', input);
  return data;
}

export async function approveLoanRequest(id: string): Promise<LoanRequest> {
  const { data } = await apiClient.post<LoanRequest>(`/loan-requests/${id}/approve`);
  return data;
}

export async function rejectLoanRequest(id: string, reason: string): Promise<LoanRequest> {
  const { data } = await apiClient.post<LoanRequest>(`/loan-requests/${id}/reject`, { reason });
  return data;
}

export async function addGuarantor(
  loanRequestId: string,
  input: AddGuarantorInput,
): Promise<Guarantor> {
  const { data } = await apiClient.post<Guarantor>(
    `/loan-requests/${loanRequestId}/guarantors`,
    input,
  );
  return data;
}

export async function listAvailableGuarantors(): Promise<AvailableGuarantor[]> {
  const { data } = await apiClient.get<AvailableGuarantor[]>('/members/available-guarantors');
  return data;
}

export async function listGuarantorInvites(memberId: string): Promise<GuarantorInvite[]> {
  const { data } = await apiClient.get<GuarantorInvite[]>(
    `/members/${memberId}/guarantor-invites`,
  );
  return data;
}

export async function respondToGuarantorInvite(
  guarantorId: string,
  action: 'accept' | 'decline',
): Promise<Guarantor> {
  const { data } = await apiClient.post<Guarantor>(`/guarantors/${guarantorId}/${action}`);
  return data;
}

export interface ListLoansParams {
  status?: LoanStatus;
  mine?: boolean;
  page?: number;
  size?: number;
}

export async function listLoans(params: ListLoansParams): Promise<PageResponse<Loan>> {
  const { data } = await apiClient.get<PageResponse<Loan>>('/loans', { params });
  return data;
}

export async function getLoan(id: string): Promise<Loan> {
  const { data } = await apiClient.get<Loan>(`/loans/${id}`);
  return data;
}

export async function listGuarantorLiabilities(loanId: string): Promise<GuarantorLiability[]> {
  const { data } = await apiClient.get<GuarantorLiability[]>(
    `/loans/${loanId}/guarantor-liabilities`,
  );
  return data;
}
