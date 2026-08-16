export type ContributionMethod = 'PAYSTACK' | 'MANUAL';

export type ContributionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  method: ContributionMethod;
  status: ContributionStatus;
  reference?: string;
  createdAt: string;
}

export interface ContributionSummary {
  memberId: string;
  totalContributed: number;
  contributionCount: number;
  lastContributionAt?: string;
}

export interface RecordManualContributionInput {
  memberId: string;
  amount: number;
  note?: string;
}
