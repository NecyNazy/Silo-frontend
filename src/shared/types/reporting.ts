export interface DashboardMetrics {
  activeLoans: number;
  totalContributions: number;
  outstandingBalance: number;
  defaultRate: number;
}

export interface TopContributor {
  memberId: string;
  totalContributions: number;
}

export interface MemberReportSummary {
  memberId: string;
  totalContributions: number;
  activeLoans: number;
  totalRepayments: number;
  outstandingBalance: number;
}
