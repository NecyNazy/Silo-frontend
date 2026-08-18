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
