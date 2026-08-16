export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const TONE_BY_STATUS: Record<string, StatusTone> = {
  VERIFIED: 'success',
  ACTIVE: 'success',
  ACCEPTED: 'success',
  APPROVED: 'success',
  CONFIRMED: 'success',
  PAID: 'success',
  SENT: 'success',
  LOW: 'success',
  OUTSTANDING: 'warning',
  PENDING: 'warning',
  LATE: 'warning',
  MEDIUM: 'warning',
  REJECTED: 'danger',
  DECLINED: 'danger',
  DEFAULTED: 'danger',
  FAILED: 'danger',
  SUSPENDED: 'danger',
  HIGH: 'danger',
  CLOSED: 'neutral',
  INACTIVE: 'neutral',
};

export function statusTone(status: string): StatusTone {
  return TONE_BY_STATUS[status] ?? 'neutral';
}
