import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

function toDate(value: string | Date): Date {
  return typeof value === 'string' ? parseISO(value) : value;
}

export function formatDate(value: string | Date, pattern = 'dd MMM yyyy'): string {
  const date = toDate(value);
  return isValid(date) ? format(date, pattern) : '-';
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, 'dd MMM yyyy, HH:mm');
}

export function formatRelative(value: string | Date): string {
  const date = toDate(value);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '-';
}
