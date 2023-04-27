import { z } from 'zod'

export const viewColumnSchema = z.record(z.object({
  width: z.number().int(),
  selected: z.boolean()
}).partial())
