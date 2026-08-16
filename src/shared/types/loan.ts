export type LoanRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LoanStatus = 'ACTIVE' | 'CLOSED' | 'DEFAULTED';

export type InstallmentStatus = 'PENDING' | 'PAID' | 'LATE' | 'DEFAULTED';

export type GuarantorStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LoanGuarantor {
  id: string;
  loanRequestId: string;
  memberId: string;
  status: GuarantorStatus;
  invitedAt: string;
}

export interface LoanRequest {
  id: string;
  memberId: string;
  amountRequested: number;
  purpose: string;
  status: LoanRequestStatus;
  submittedAt: string;
}

/**
 * The real backend has no GET endpoint that returns a loan request's
 * guarantors — this shape is only produced by the MSW gap-fill handler
 * (see tests/mocks/handlers/gaps.ts) until one exists.
 */
export interface LoanRequestWithGuarantors extends LoanRequest {
  guarantors: LoanGuarantor[];
}

export interface GuarantorInvite {
  id: string;
  loanRequestId: string;
  borrowerMemberId: string;
  amountRequested: number;
  purpose: string;
  borrowerRiskTier: RiskTier;
  invitedAt: string;
}

export interface AvailableGuarantor {
  memberId: string;
  email: string;
  credibilityScore: number;
}

export interface LoanInstallment {
  id: string;
  installmentNumber: number;
  dueDate: string;
  expectedAmount: number;
  status: InstallmentStatus;
  paidDate?: string | null;
}

export interface Loan {
  id: string;
  loanRequestId: string;
  memberId: string;
  principalAmount: number;
  interestRate: number;
  durationMonths: number;
  disbursedDate: string;
  status: LoanStatus;
  outstandingBalance: number;
}

export interface LoanDetail extends Loan {
  installments: LoanInstallment[];
}

export interface CreateLoanRequestInput {
  amountRequested: number;
  purpose: string;
}

export interface AddGuarantorInput {
  guarantorMemberId: string;
}

export interface ApproveLoanRequestInput {
  interestRate: number;
  durationMonths: number;
}
