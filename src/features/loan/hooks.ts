import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import type { AddGuarantorInput, CreateLoanRequestInput } from '@/shared/types/loan';
import {
  addGuarantor,
  approveLoanRequest,
  createLoanRequest,
  getLoan,
  getLoanRequest,
  listAvailableGuarantors,
  listGuarantorInvites,
  listGuarantorLiabilities,
  listLoanRequests,
  listLoans,
  rejectLoanRequest,
  respondToGuarantorInvite,
  type ListLoanRequestsParams,
  type ListLoansParams,
} from './api';

export function useMyLoanRequests() {
  const memberId = useAuthStore((s) => s.memberId);
  return useQuery({
    queryKey: ['loan-requests', 'mine', memberId],
    queryFn: () => listLoanRequests({ mine: true }),
    enabled: Boolean(memberId),
  });
}

export function useMyLoans() {
  const memberId = useAuthStore((s) => s.memberId);
  return useQuery({
    queryKey: ['loans', 'mine', memberId],
    queryFn: () => listLoans({ mine: true }),
    enabled: Boolean(memberId),
  });
}

export function useLoanRequests(params: ListLoanRequestsParams) {
  return useQuery({
    queryKey: ['loan-requests', params],
    queryFn: () => listLoanRequests(params),
  });
}

export function useLoanRequest(id: string | undefined) {
  return useQuery({
    queryKey: ['loan-requests', id],
    queryFn: () => getLoanRequest(id as string),
    enabled: Boolean(id),
    staleTime: 10_000,
  });
}

export function useLoans(params: ListLoansParams) {
  return useQuery({
    queryKey: ['loans', 'list', params],
    queryFn: () => listLoans(params),
  });
}

export function useLoan(id: string | undefined) {
  return useQuery({
    queryKey: ['loans', id],
    queryFn: () => getLoan(id as string),
    enabled: Boolean(id),
    staleTime: 10_000,
  });
}

export function useLoanOrRequest(id: string | undefined) {
  const loanQuery = useLoan(id);
  const requestQuery = useLoanRequest(loanQuery.isError ? id : undefined);

  if (loanQuery.data) {
    return { kind: 'loan' as const, loan: loanQuery.data, isLoading: false, isError: false };
  }
  if (requestQuery.data) {
    return {
      kind: 'request' as const,
      request: requestQuery.data,
      isLoading: false,
      isError: false,
    };
  }
  return {
    kind: null,
    isLoading: loanQuery.isLoading || (loanQuery.isError && requestQuery.isLoading),
    isError: loanQuery.isError && requestQuery.isError,
  };
}

export function useGuarantorLiabilities(loanId: string | undefined) {
  return useQuery({
    queryKey: ['loans', loanId, 'guarantor-liabilities'],
    queryFn: () => listGuarantorLiabilities(loanId as string),
    enabled: Boolean(loanId),
  });
}

export function useCreateLoanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLoanRequestInput) => createLoanRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-requests', 'mine'] });
    },
  });
}

export function useAddGuarantor(loanRequestId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddGuarantorInput) => addGuarantor(loanRequestId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-requests', loanRequestId] });
    },
  });
}

export function useAvailableGuarantors() {
  return useQuery({
    queryKey: ['members', 'available-guarantors'],
    queryFn: () => listAvailableGuarantors(),
  });
}

export function useGuarantorInvites() {
  const memberId = useAuthStore((s) => s.memberId);
  return useQuery({
    queryKey: ['guarantor-invites', memberId],
    queryFn: () => listGuarantorInvites(memberId as string),
    enabled: Boolean(memberId),
  });
}

export function useRespondToGuarantorInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ guarantorId, action }: { guarantorId: string; action: 'accept' | 'decline' }) =>
      respondToGuarantorInvite(guarantorId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guarantor-invites'] });
    },
  });
}

export function useApproveLoanRequest(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveLoanRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-requests', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['loan-requests', id] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}

export function useRejectLoanRequest(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => rejectLoanRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-requests', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['loan-requests', id] });
    },
  });
}
