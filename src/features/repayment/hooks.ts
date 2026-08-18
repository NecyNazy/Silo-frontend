import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRepaymentInput } from '@/shared/types/repayment';
import { createRepayment } from './api';

export function useCreateRepayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRepaymentInput) => createRepayment(input),
    onSuccess: (repayment) => {
      queryClient.invalidateQueries({ queryKey: ['loans', repayment.loanId] });
    },
  });
}
