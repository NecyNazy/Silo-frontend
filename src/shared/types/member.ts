export type Role = 'MEMBER' | 'OFFICER';

export type MemberStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  status: MemberStatus;
  kycStatus: KycStatus;
  creditScore: number;
  idDocumentRef?: string;
  createdAt: string;
}

export interface UpdateMemberInput {
  fullName?: string;
  phone?: string;
}

export interface RegisterMemberInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
