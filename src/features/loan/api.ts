import { apiClient } from '@/shared/api/client';
import type {
  AddGuarantorInput,
  ApproveLoanRequestInput,
  AvailableGuarantor,
  CreateLoanRequestInput,
  GuarantorInvite,
  Loan,
  LoanDetail,
  LoanGuarantor,
  LoanRequest,
  LoanRequestStatus,
  LoanRequestWithGuarantors,
  LoanStatus,
} from '@/shared/types/loan';

export interface ListLoanRequestsParams {
  status?: LoanRequestStatus;
  mine?: boolean;
}

export async function listLoanRequests(params: ListLoanRequestsParams): Promise<LoanRequest[]> {
  const { data } = await apiClient.get<LoanRequest[]>('/loan-requests', { params });
  return data;
}

export async function getLoanRequest(id: string): Promise<LoanRequestWithGuarantors> {
  const { data } = await apiClient.get<LoanRequestWithGuarantors>(`/loan-requests/${id}`);
  return data;
}

export async function createLoanRequest(input: CreateLoanRequestInput): Promise<LoanRequest> {
  const { data } = await apiClient.post<LoanRequest>('/loan-requests', input);
  return data;
}

export async function approveLoanRequest(
  id: string,
  input: ApproveLoanRequestInput,
): Promise<Loan> {
  const { data } = await apiClient.post<Loan>(`/loan-requests/${id}/approve`, input);
  return data;
}

export async function rejectLoanRequest(id: string): Promise<LoanRequest> {
  const { data } = await apiClient.post<LoanRequest>(`/loan-requests/${id}/reject`);
  return data;
}

export async function addGuarantor(
  loanRequestId: string,
  input: AddGuarantorInput,
): Promise<LoanGuarantor> {
  const { data } = await apiClient.post<LoanGuarantor>(
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
): Promise<LoanGuarantor> {
  const { data } = await apiClient.post<LoanGuarantor>(`/guarantors/${guarantorId}/${action}`);
  return data;
}

export interface ListLoansParams {
  status?: LoanStatus;
  mine?: boolean;
}

export async function listLoans(params: ListLoansParams): Promise<Loan[]> {
  const { data } = await apiClient.get<Loan[]>('/loans', { params });
  return data;
}

export async function getLoan(id: string): Promise<LoanDetail> {
  const { data } = await apiClient.get<LoanDetail>(`/loans/${id}`);
  return data;
}
