import { z } from 'zod';

export const repaymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  reference: z.string().min(1, 'Reference is required'),
});

export type RepaymentFormValues = z.input<typeof repaymentSchema>;
export type RepaymentSubmitValues = z.output<typeof repaymentSchema>;
