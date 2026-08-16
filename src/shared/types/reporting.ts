export interface DashboardMetrics {
  activeLoans: number;
  totalContributions: number;
  outstandingBalance: number;
  defaultRatePercent: number;
  generatedAt: string;
}

export interface ContributionTrendPoint {
  period: string;
  amount: number;
}

export interface TopContributor {
  memberId: string;
  memberName: string;
  totalContributed: number;
}
