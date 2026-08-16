export interface Repayment {
  id: string;
  loanId: string;
  payerMemberId: string;
  liabilityId?: string | null;
  amount: number;
  reference: string;
  paymentDate: string;
}

export interface CreateRepaymentInput {
  loanId: string;
  amount: number;
  reference: string;
}

export interface CreateLiabilityRepaymentInput {
  liabilityId: string;
  amount: number;
  reference: string;
}
