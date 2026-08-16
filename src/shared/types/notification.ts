export type NotificationType =
  | 'KYC_STATUS'
  | 'CONTRIBUTION'
  | 'LOAN_STATUS'
  | 'GUARANTOR_INVITE'
  | 'GUARANTOR_LIABILITY'
  | 'REPAYMENT_DUE';

export interface Notification {
  id: string;
  memberId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
