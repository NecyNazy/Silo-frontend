import { z } from 'zod';
import { ID_TYPES } from '@/shared/types/member';

export const updateMemberProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().regex(/^\d{11}$/, 'Enter an 11-digit phone number, no spaces or +'),
  idType: z.enum(ID_TYPES).optional(),
  idNumber: z.string().optional(),
});

export type UpdateMemberProfileFormValues = z.infer<typeof updateMemberProfileSchema>;
