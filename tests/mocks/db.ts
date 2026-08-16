import type { Contribution } from '@/shared/types/contribution';
import type { Loan, LoanRequestWithGuarantors } from '@/shared/types/loan';
import type { Member } from '@/shared/types/member';

/**
 * Fixture data backing the MSW "gap-fill" handlers only — the endpoints the
 * real backend doesn't expose yet (see handlers/gaps.ts). Everything else
 * talks to the real API, so this data is intentionally disconnected from it:
 * a loan request submitted for real won't show up here, and vice versa.
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
