import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'singleSelect',
  {
    baseType: 'smallint',
    optionSchema: z.object({
      items: z.object({
        id: z.number().int().max(30000).min(-30000),
        name: z.string()
      }).array()
    })
  },
  opts => z.number().int()
)
