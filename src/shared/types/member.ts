export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  kycStatus: KycStatus;
  idType?: string | null;
  idNumber?: string | null;
  idDocumentRef?: string | null;
  status: MemberStatus;
  joinedDate: string;
}

export interface CreateMemberInput {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateMemberProfileInput {
  fullName: string;
  phoneNumber: string;
  idType?: string;
  idNumber?: string;
  idDocumentRef?: string;
}

export interface RegisterMemberInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}
