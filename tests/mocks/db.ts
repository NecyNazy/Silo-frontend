import type { Contribution } from '@/shared/types/contribution';
import type { Guarantor, Loan, LoanRequest } from '@/shared/types/loan';
import type { Member } from '@/shared/types/member';
import type { Notification } from '@/shared/types/notification';

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export const members: Member[] = [
  {
    id: 'mem-officer-1',
    fullName: 'Ada Officer',
    email: 'officer@silo.dev',
    phone: '+2348010000001',
    role: 'OFFICER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    creditScore: 0,
    createdAt: daysAgo(400),
  },
  {
    id: 'mem-1',
    fullName: 'Chidi Okafor',
    email: 'member@silo.dev',
    phone: '+2348020000002',
    role: 'MEMBER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    creditScore: 72,
    idDocumentRef: 'doc_chidi_id.pdf',
    createdAt: daysAgo(200),
  },
  {
    id: 'mem-2',
    fullName: 'Ngozi Bello',
    email: 'guarantor@silo.dev',
    phone: '+2348030000003',
    role: 'MEMBER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    creditScore: 88,
    idDocumentRef: 'doc_ngozi_id.pdf',
    createdAt: daysAgo(250),
  },
  {
    id: 'mem-3',
    fullName: 'Femi Adeyemi',
    email: 'femi@silo.dev',
    phone: '+2348040000004',
    role: 'MEMBER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    creditScore: 65,
    idDocumentRef: 'doc_femi_id.pdf',
    createdAt: daysAgo(180),
  },
  {
    id: 'mem-4',
    fullName: 'Bisi Lawal',
    email: 'pending@silo.dev',
    phone: '+2348050000005',
    role: 'MEMBER',
    status: 'PENDING',
    kycStatus: 'PENDING',
    creditScore: 0,
    createdAt: daysAgo(2),
  },
];

export const loanRequests: LoanRequest[] = [
  {
    id: 'lr-1',
    memberId: 'mem-1',
    memberName: 'Chidi Okafor',
    amount: 150_000,
    purpose: 'Shop inventory restock',
    termMonths: 6,
    status: 'PENDING',
    createdAt: daysAgo(3),
    guarantors: [
      {
        id: 'g-1',
        loanRequestId: 'lr-1',
        guarantorMemberId: 'mem-2',
        guarantorName: 'Ngozi Bello',
        guarantorCreditScore: 88,
        status: 'ACCEPTED',
        respondedAt: daysAgo(2),
      },
      {
        id: 'g-2',
        loanRequestId: 'lr-1',
        guarantorMemberId: 'mem-3',
        guarantorName: 'Femi Adeyemi',
        guarantorCreditScore: 65,
        status: 'INVITED',
      },
    ],
  },
];

export const loans: Loan[] = [
  {
    id: 'loan-1',
    loanRequestId: 'lr-0',
    memberId: 'mem-1',
    memberName: 'Chidi Okafor',
    principal: 100_000,
    interestRate: 8,
    outstandingBalance: 51_000,
    status: 'ACTIVE',
    disbursedAt: daysAgo(90),
    guarantors: [
      {
        id: 'g-0',
        loanRequestId: 'lr-0',
        guarantorMemberId: 'mem-2',
        guarantorName: 'Ngozi Bello',
        guarantorCreditScore: 88,
        status: 'ACCEPTED',
        respondedAt: daysAgo(95),
      },
    ],
    installments: [
      {
        id: 'inst-1',
        loanId: 'loan-1',
        installmentNumber: 1,
        dueDate: daysAgo(60),
        amountDue: 25_500,
        amountPaid: 25_500,
        status: 'PAID',
      },
      {
        id: 'inst-2',
        loanId: 'loan-1',
        installmentNumber: 2,
        dueDate: daysAgo(30),
        amountDue: 25_500,
        amountPaid: 25_500,
        status: 'PAID',
      },
      {
        id: 'inst-3',
        loanId: 'loan-1',
        installmentNumber: 3,
        dueDate: daysFromNow(1),
        amountDue: 25_500,
        amountPaid: 0,
        status: 'PENDING',
      },
      {
        id: 'inst-4',
        loanId: 'loan-1',
        installmentNumber: 4,
        dueDate: daysFromNow(31),
        amountDue: 25_500,
        amountPaid: 0,
        status: 'PENDING',
      },
    ],
  },
];

export const contributions: Contribution[] = [
  {
    id: 'con-1',
    memberId: 'mem-1',
    memberName: 'Chidi Okafor',
    amount: 20_000,
    method: 'MANUAL',
    status: 'CONFIRMED',
    reference: 'manual-001',
    createdAt: daysAgo(60),
  },
  {
    id: 'con-2',
    memberId: 'mem-1',
    memberName: 'Chidi Okafor',
    amount: 15_000,
    method: 'PAYSTACK',
    status: 'CONFIRMED',
    reference: 'paystack-001',
    createdAt: daysAgo(30),
  },
  {
    id: 'con-3',
    memberId: 'mem-1',
    memberName: 'Chidi Okafor',
    amount: 10_000,
    method: 'PAYSTACK',
    status: 'CONFIRMED',
    reference: 'paystack-002',
    createdAt: daysAgo(5),
  },
];

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    memberId: 'mem-1',
    type: 'KYC_STATUS',
    title: 'KYC verified',
    message: 'Your identity document was approved by an officer.',
    read: true,
    createdAt: daysAgo(180),
  },
  {
    id: 'notif-2',
    memberId: 'mem-1',
    type: 'CONTRIBUTION',
    title: 'Contribution confirmed',
    message: 'Your contribution of ₦10,000 was confirmed.',
    read: false,
    createdAt: daysAgo(5),
  },
  {
    id: 'notif-3',
    memberId: 'mem-2',
    type: 'GUARANTOR_INVITE',
    title: 'Guarantor request',
    message: 'Chidi Okafor asked you to guarantee a loan request.',
    read: false,
    createdAt: daysAgo(3),
  },
];

export function findMemberByEmail(email: string): Member | undefined {
  return members.find((m) => m.email.toLowerCase() === email.toLowerCase());
}

export function findGuarantorById(id: string): { request: LoanRequest; guarantor: Guarantor } | undefined {
  for (const request of loanRequests) {
    const guarantor = request.guarantors.find((g) => g.id === id);
    if (guarantor) return { request, guarantor };
  }
  return undefined;
}
