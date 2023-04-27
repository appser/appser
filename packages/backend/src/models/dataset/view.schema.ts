import { filterSchema } from 'backend/models/dataset/view.filter.schema'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import { viewColumnSchema } from './view.column.schema'

export const viewSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(['grid']),
  column: viewColumnSchema,
  /** Store column sort index. */
  columns: z.string().array().nonempty(),
  sorts: z.string().array().nonempty(),
  filter: filterSchema.optional(),
  stickyColumn: z.number().int()
})

export type TView = z.infer<typeof viewSchema>

export const renderDefaultView = (view: Partial<TView> = {}): TView => Object.assign({
  id: genSnowflakeId().toString(),
  type: 'grid',
  sorts: ['-id'],
  column: {
    id: { selected: false },
    name: { selected: true },
    creator: { selected: false },
    lastEditor: { selected: false },
    createdAt: { selected: false },
    updatedAt: { selected: false }
  },
  columns: ['id', 'name', 'creator', 'lastEditor', 'createdAt', 'updatedAt'],
  stickyColumn: 0
} as TView, view)
