import type {
  AutoDebitMandate,
  AutoDebitPeriodicity,
  Contribution,
} from '@/shared/types/contribution';
import type { Loan, LoanInstallment, LoanRequestWithGuarantors } from '@/shared/types/loan';
import type { Member } from '@/shared/types/member';
import type { Notification } from '@/shared/types/notification';
import type { OfficerApplicationStatus } from '@/shared/types/officerApplication';

/**
 * Fixture data backing the MSW "gap-fill" handlers (the endpoints the real
 * backend doesn't expose yet, see handlers/gaps.ts) and the local-preview
 * demo accounts (handlers/demo.ts). Everything else talks to the real API,
 * so this data is intentionally disconnected from it: a loan request
 * submitted for real won't show up here, and vice versa.
 */

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const members: Member[] = [
  {
    id: 'seed-mem-1',
    fullName: 'Chidi Okafor',
    email: 'seed-member@silo.dev',
    phoneNumber: '+2348020000002',
    kycStatus: 'VERIFIED',
    idType: 'National ID',
    idNumber: 'NIN-00291823',
    idDocumentRef: null,
    status: 'ACTIVE',
    joinedDate: daysAgo(200),
  },
  {
    id: 'seed-mem-2',
    fullName: 'Ngozi Bello',
    email: 'seed-guarantor@silo.dev',
    phoneNumber: '+2348030000003',
    kycStatus: 'VERIFIED',
    idType: 'National ID',
    idNumber: 'NIN-00291824',
    idDocumentRef: null,
    status: 'ACTIVE',
    joinedDate: daysAgo(250),
  },
  {
    id: 'seed-mem-3',
    fullName: 'Femi Adeyemi',
    email: 'seed-femi@silo.dev',
    phoneNumber: '+2348040000004',
    kycStatus: 'VERIFIED',
    idType: null,
    idNumber: null,
    idDocumentRef: null,
    status: 'ACTIVE',
    joinedDate: daysAgo(180),
  },
  {
    id: 'seed-mem-4',
    fullName: 'Bisi Lawal',
    email: 'seed-pending@silo.dev',
    phoneNumber: '+2348050000005',
    kycStatus: 'PENDING',
    idType: null,
    idNumber: null,
    idDocumentRef: null,
    status: 'ACTIVE',
    joinedDate: daysAgo(2),
  },
  {
    id: 'seed-mem-5',
    fullName: 'Amaka Chukwu',
    email: 'seed-officer@silo.dev',
    phoneNumber: '+2348060000006',
    kycStatus: 'VERIFIED',
    idType: 'National ID',
    idNumber: 'NIN-00291825',
    idDocumentRef: null,
    status: 'ACTIVE',
    joinedDate: daysAgo(400),
  },
];

/** Local-preview accounts for `npm run dev` without a backend. See handlers/demo.ts. */
export const demoAccounts = [
  { memberId: 'seed-mem-1', email: 'seed-member@silo.dev', password: 'password123', role: 'MEMBER' as const },
  { memberId: 'seed-mem-5', email: 'seed-officer@silo.dev', password: 'password123', role: 'OFFICER' as const },
];

export const loanRequests: LoanRequestWithGuarantors[] = [
  {
    id: 'seed-lr-1',
    memberId: 'seed-mem-1',
    amountRequested: 150_000,
    purpose: 'Shop inventory restock',
    status: 'PENDING',
    submittedAt: daysAgo(3),
    guarantors: [
      {
        id: 'seed-g-1',
        loanRequestId: 'seed-lr-1',
        memberId: 'seed-mem-2',
        status: 'ACCEPTED',
        invitedAt: daysAgo(2),
      },
      {
        id: 'seed-g-2',
        loanRequestId: 'seed-lr-1',
        memberId: 'seed-mem-3',
        status: 'PENDING',
        invitedAt: daysAgo(2),
      },
    ],
  },
  {
    id: 'seed-lr-0',
    memberId: 'seed-mem-1',
    amountRequested: 100_000,
    purpose: 'Prior approved request backing the seed loan',
    status: 'APPROVED',
    submittedAt: daysAgo(95),
    guarantors: [
      {
        id: 'seed-g-0',
        loanRequestId: 'seed-lr-0',
        memberId: 'seed-mem-2',
        status: 'ACCEPTED',
        invitedAt: daysAgo(95),
      },
    ],
  },
  {
    id: 'seed-lr-2',
    memberId: 'seed-mem-3',
    amountRequested: 60_000,
    purpose: 'Generator repair',
    status: 'PENDING',
    submittedAt: daysAgo(1),
    guarantors: [
      {
        id: 'seed-g-3',
        loanRequestId: 'seed-lr-2',
        memberId: 'seed-mem-1',
        status: 'PENDING',
        invitedAt: daysAgo(1),
      },
    ],
  },
];

export const loans: Loan[] = [
  {
    id: 'seed-loan-1',
    loanRequestId: 'seed-lr-0',
    memberId: 'seed-mem-1',
    principalAmount: 100_000,
    interestRate: 8,
    durationMonths: 4,
    disbursedDate: daysAgo(90),
    status: 'ACTIVE',
    outstandingBalance: 51_000,
  },
];

export const installmentsByLoanId: Record<string, LoanInstallment[]> = {
  'seed-loan-1': [
    {
      id: 'seed-inst-1',
      installmentNumber: 1,
      dueDate: daysAgo(60),
      expectedAmount: 27_000,
      status: 'PAID',
      paidDate: daysAgo(62),
    },
    {
      id: 'seed-inst-2',
      installmentNumber: 2,
      dueDate: daysAgo(30),
      expectedAmount: 27_000,
      status: 'PAID',
      paidDate: daysAgo(29),
    },
    {
      id: 'seed-inst-3',
      installmentNumber: 3,
      dueDate: daysAgo(0),
      expectedAmount: 27_000,
      status: 'PENDING',
      paidDate: null,
    },
    {
      id: 'seed-inst-4',
      installmentNumber: 4,
      dueDate: daysAgo(-30),
      expectedAmount: 27_000,
      status: 'PENDING',
      paidDate: null,
    },
  ],
};

export const notifications: Notification[] = [
  {
    id: 'seed-notif-1',
    memberId: 'seed-mem-1',
    eventType: 'LOAN_APPROVED',
    channel: 'EMAIL',
    status: 'SENT',
    sentAt: daysAgo(90),
  },
  {
    id: 'seed-notif-2',
    memberId: 'seed-mem-1',
    eventType: 'GUARANTOR_INVITED',
    channel: 'EMAIL',
    status: 'SENT',
    sentAt: daysAgo(3),
  },
  {
    id: 'seed-notif-3',
    memberId: 'seed-mem-1',
    eventType: 'REPAYMENT_RECEIVED',
    channel: 'EMAIL',
    status: 'SENT',
    sentAt: daysAgo(29),
  },
];

export interface DemoOfficerApplication {
  id: string;
  memberId: string;
  status: OfficerApplicationStatus;
  approvedByMemberIds: string[];
  createdAt: string;
  decidedAt: string | null;
}

export const officerApplications: DemoOfficerApplication[] = [
  {
    id: 'seed-oa-1',
    memberId: 'seed-mem-3',
    status: 'PENDING',
    approvedByMemberIds: [],
    createdAt: daysAgo(4),
    decidedAt: null,
  },
];

/** Keyed by memberId. See handlers/demo.ts for the auto-debit endpoints. */
export const autoDebitMandates: Record<string, AutoDebitMandate> = {};

function nextChargeDateFor(periodicity: AutoDebitPeriodicity): string {
  const days = periodicity === 'WEEKLY' ? 7 : 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function createDemoMandate(
  memberId: string,
  amount: number,
  periodicity: AutoDebitPeriodicity,
): AutoDebitMandate {
  const mandate: AutoDebitMandate = {
    id: `seed-ad-${memberId}`,
    amount,
    periodicity,
    status: 'ACTIVE',
    nextChargeDate: nextChargeDateFor(periodicity),
    consecutiveFailureCount: 0,
    lastFailureReason: null,
  };
  autoDebitMandates[memberId] = mandate;
  return mandate;
}

export const contributions: Contribution[] = [
  {
    id: 'seed-con-1',
    memberId: 'seed-mem-1',
    amount: 20_000,
    reference: 'seed-manual-001',
    source: 'MANUAL',
    recordedBy: null,
    contributionDate: daysAgo(60),
  },
  {
    id: 'seed-con-2',
    memberId: 'seed-mem-1',
    amount: 15_000,
    reference: 'seed-paystack-001',
    source: 'PAYSTACK',
    recordedBy: null,
    contributionDate: daysAgo(30),
  },
  {
    id: 'seed-con-3',
    memberId: 'seed-mem-2',
    amount: 10_000,
    reference: 'seed-paystack-002',
    source: 'PAYSTACK',
    recordedBy: null,
    contributionDate: daysAgo(5),
  },
];
