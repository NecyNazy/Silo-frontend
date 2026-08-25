export type ContributionSource = 'MANUAL' | 'PAYSTACK';

export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  reference: string;
  source: ContributionSource;
  recordedBy?: string | null;
  contributionDate: string;
}

export interface ContributionSummary {
  memberId: string;
  totalAmount: number;
  contributionCount: number;
}

export interface RecordManualContributionInput {
  memberId: string;
  amount: number;
  reference: string;
}

export type AutoDebitPeriodicity = 'WEEKLY' | 'MONTHLY';

export type AutoDebitStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'FAILED';

export interface AutoDebitMandate {
  id: string;
  amount: number;
  periodicity: AutoDebitPeriodicity;
  status: AutoDebitStatus;
  nextChargeDate: string;
  consecutiveFailureCount: number;
  lastFailureReason: string | null;
}

export interface SetupAutoDebitInput {
  amount: number;
  periodicity: AutoDebitPeriodicity;
}

export type AutoDebitAction = 'PAUSE' | 'RESUME' | 'CANCEL';

export interface UpdateAutoDebitInput {
  amount?: number;
  periodicity?: AutoDebitPeriodicity;
  action?: AutoDebitAction;
}
