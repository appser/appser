import { z } from 'zod'

import { conditionSchema } from './condition'

export const filterSchema = z.object({
  and: conditionSchema.array(),
  or: conditionSchema.array()
}).partial()

export type Filter = z.infer<typeof filterSchema>
