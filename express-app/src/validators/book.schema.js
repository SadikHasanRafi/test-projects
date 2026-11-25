// Express has no built-in validation. Zod is a popular choice.
import { z } from 'zod'

export const bookSchema = z.object({
  title: z.string().min(1).max(100),
  author: z.string().min(1).max(100),
  year: z.int().min(0).max(2100).nullable().optional(),
})
