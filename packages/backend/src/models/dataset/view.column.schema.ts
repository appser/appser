import { z } from 'zod'

export const viewColumnSchema = z.object({
  width: z.number().int(),
  selected: z.boolean()
}).partial()
