import { filterSchema } from 'backend/models/dataset/view.filter.schema'
import { z } from 'zod'

import { viewColumnSchema } from './view.column.schema'

export const viewSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(['grid']).default('grid'),
  column: z.record(viewColumnSchema),
  /** Store column sort index. */
  columns: z.string().array().nonempty(),
  sorts: z.string().array().nonempty().default(['-id']),
  filter: filterSchema.optional(),
  stickyColumn: z.number().int().default(0)
})

export type TView = z.infer<typeof viewSchema>
