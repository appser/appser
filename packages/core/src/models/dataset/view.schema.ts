import { filterSchema } from 'core/models/dataset/view.filter.schema'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import { z } from 'zod'

const viewFieldSchema = z.record(z.object({
  width: z.number().int(),
  selected: z.boolean()
}).partial())

export const viewSchema = z.object({
  id: z.string().default(() => genSnowflakeId().toString()),
  name: z.string().optional(),
  type: z.enum(['sheet']).default('sheet'),
  field: viewFieldSchema.default({
    id: { selected: false },
    name: { selected: true },
    creator: { selected: false },
    lastEditor: { selected: false },
    createdAt: { selected: false },
    updatedAt: { selected: false }
  }),
  /** Store field sort index. */
  fields: z.string().array().nonempty().default([
    'id',
    'name',
    'creator',
    'lastEditor',
    'createdAt',
    'updatedAt'
  ]),
  sorts: z.string().array().nonempty().default(['-id']),
  filter: filterSchema.optional(),
  stickyField: z.number().int().default(0)
})

export type TView = z.infer<typeof viewSchema>
