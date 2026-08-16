export type LoanRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LoanStatus = 'ACTIVE' | 'CLOSED' | 'DEFAULTED';

export type InstallmentStatus = 'PENDING' | 'PAID' | 'LATE' | 'DEFAULTED';

export type GuarantorStatus = 'INVITED' | 'ACCEPTED' | 'DECLINED';

export interface Guarantor {
  id: string;
  loanRequestId: string;
  guarantorMemberId: string;
  guarantorName: string;
  guarantorCreditScore: number;
  status: GuarantorStatus;
  respondedAt?: string;
}

export interface GuarantorInvite extends Guarantor {
  requesterMemberId: string;
  requesterName: string;
  requesterCreditScore: number;
  requestedAmount: number;
}

export interface LoanRequest {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  purpose: string;
  termMonths: number;
  status: LoanRequestStatus;
  guarantors: Guarantor[];
  createdAt: string;
  decidedAt?: string;
  rejectionReason?: string;
}

export interface LoanInstallment {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  status: InstallmentStatus;
}

export interface Loan {
  id: string;
  loanRequestId: string;
  memberId: string;
  memberName: string;
  principal: number;
  interestRate: number;
  outstandingBalance: number;
  status: LoanStatus;
  disbursedAt: string;
  installments: LoanInstallment[];
  guarantors: Guarantor[];
}

export interface GuarantorLiability {
  id: string;
  loanId: string;
  guarantorMemberId: string;
  amount: number;
  amountPaid: number;
  status: 'OUTSTANDING' | 'PAID';
  createdAt: string;
}

export interface AvailableGuarantor {
  memberId: string;
  fullName: string;
  creditScore: number;
}

export interface CreateLoanRequestInput {
  amount: number;
  purpose: string;
  termMonths: number;
}

export interface AddGuarantorInput {
  guarantorMemberId: string;
}
