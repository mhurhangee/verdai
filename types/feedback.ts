import { z } from 'zod'

export const FeedbackSchema = z.object({
  message: z
    .string()
    .min(3, 'Feedback must be at least 3 characters')
    .max(2048, 'Feedback must be at most 2048 characters'),
  page: z.string().max(255, 'Invalid page').optional(),
})

export type FeedbackInput = z.infer<typeof FeedbackSchema>
