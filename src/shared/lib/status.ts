export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const TONE_BY_STATUS: Record<string, StatusTone> = {
  VERIFIED: 'success',
  ACTIVE: 'success',
  ACCEPTED: 'success',
  APPROVED: 'success',
  CONFIRMED: 'success',
  PAID: 'success',
  OUTSTANDING: 'warning',
  PENDING: 'warning',
  LATE: 'warning',
  INVITED: 'info',
  REJECTED: 'danger',
  DECLINED: 'danger',
  DEFAULTED: 'danger',
  FAILED: 'danger',
  SUSPENDED: 'danger',
  CLOSED: 'neutral',
};

export function statusTone(status: string): StatusTone {
  return TONE_BY_STATUS[status] ?? 'neutral';
}
