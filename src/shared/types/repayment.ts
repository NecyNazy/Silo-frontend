export type RepaymentType = 'INSTALLMENT' | 'LIABILITY';

export interface Repayment {
  id: string;
  loanId: string;
  type: RepaymentType;
  amount: number;
  paidAt: string;
}

export interface CreateRepaymentInput {
  loanId: string;
  amount: number;
}

export interface CreateLiabilityRepaymentInput {
  liabilityId: string;
  amount: number;
}
