import { z } from 'zod';

export const updateMemberProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(7, 'Enter a valid phone number'),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  idDocumentRef: z.string().optional(),
});

export type UpdateMemberProfileFormValues = z.infer<typeof updateMemberProfileSchema>;
