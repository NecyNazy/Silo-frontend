import { authHandlers } from './auth';
import { contributionHandlers } from './contribution';
import { loanHandlers } from './loan';
import { memberHandlers } from './member';
import { notificationHandlers } from './notification';
import { repaymentHandlers } from './repayment';
import { reportingHandlers } from './reporting';

export const handlers = [
  ...authHandlers,
  ...memberHandlers,
  ...contributionHandlers,
  ...loanHandlers,
  ...repaymentHandlers,
  ...notificationHandlers,
  ...reportingHandlers,
];
