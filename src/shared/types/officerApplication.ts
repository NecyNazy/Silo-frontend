export type OfficerApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OfficerApplication {
  id: string;
  memberId: string;
  status: OfficerApplicationStatus;
  approvalCount: number;
  approvedByCaller: boolean;
  createdAt: string;
  decidedAt: string | null;
}
