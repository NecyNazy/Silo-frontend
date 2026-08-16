import { z } from 'zod';

export const createLoanRequestSchema = z.object({
  amountRequested: z.coerce.number().positive('Amount must be greater than zero'),
  purpose: z.string().min(5, 'Tell us what this loan is for'),
});

export type CreateLoanRequestFormValues = z.input<typeof createLoanRequestSchema>;
export type CreateLoanRequestSubmitValues = z.output<typeof createLoanRequestSchema>;

export const addGuarantorSchema = z.object({
  guarantorMemberId: z.string().min(1, 'Select a guarantor'),
});

export type AddGuarantorFormValues = z.infer<typeof addGuarantorSchema>;

export const approveLoanRequestSchema = z.object({
  interestRate: z.coerce.number().min(0, 'Interest rate must be zero or greater'),
  durationMonths: z.coerce.number().int().positive('Duration must be at least 1 month'),
});

export type ApproveLoanRequestFormValues = z.input<typeof approveLoanRequestSchema>;
export type ApproveLoanRequestSubmitValues = z.output<typeof approveLoanRequestSchema>;
