import { z } from 'zod';

export const updateMemberSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(7, 'Enter a valid phone number'),
});

export type UpdateMemberFormValues = z.infer<typeof updateMemberSchema>;
