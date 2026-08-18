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

export const ID_TYPES = ['National ID', 'Passport', "Driver's License"] as const;
export type IdType = (typeof ID_TYPES)[number];

export interface UpdateMemberProfileInput {
  fullName: string;
  phoneNumber: string;
  idType?: string;
  idNumber?: string;
  /**
   * Never user-typed. Passed through from the member's current value so a
   * profile edit doesn't overwrite what POST /kyc-document set. See
   * EditProfileDialog.
   */
  idDocumentRef?: string;
}

export interface RegisterMemberInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface KycDocumentExtraction {
  idType: IdType | null;
  idNumber: string | null;
  confidence: number;
}

export interface KycDocumentUploadResponse {
  member: Member;
  extracted: KycDocumentExtraction | null;
}
