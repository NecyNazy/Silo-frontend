import { z } from 'zod';

export const createLoanRequestSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  purpose: z.string().min(5, 'Tell us what this loan is for'),
  termMonths: z.coerce.number().int().positive('Term must be at least 1 month'),
});

export type CreateLoanRequestFormValues = z.input<typeof createLoanRequestSchema>;
export type CreateLoanRequestSubmitValues = z.output<typeof createLoanRequestSchema>;

export const addGuarantorSchema = z.object({
  guarantorMemberId: z.string().min(1, 'Select a guarantor'),
});

export type AddGuarantorFormValues = z.infer<typeof addGuarantorSchema>;

export const rejectLoanRequestSchema = z.object({
  reason: z.string().min(5, 'Give a reason for the rejection'),
});

export type RejectLoanRequestFormValues = z.infer<typeof rejectLoanRequestSchema>;
