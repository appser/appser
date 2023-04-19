import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'multipleSelect',
  {
    baseType: 'jsonb',
    optionSchema: z.object({
      items: z.object({
        id: z.number().int().max(30000).min(-30000),
        name: z.string()
      }).array()
    })
  },
  opts => z.number().array()
)
