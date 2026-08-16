import { z } from 'zod';

export const manualContributionSchema = z.object({
  memberId: z.string().min(1, 'Select a member'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  note: z.string().optional(),
});

export type ManualContributionFormValues = z.input<typeof manualContributionSchema>;
export type ManualContributionSubmitValues = z.output<typeof manualContributionSchema>;
