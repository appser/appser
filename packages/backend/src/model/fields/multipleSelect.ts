import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'multipleSelect',
  {
    baseType: 'jsonb',
    optionSchema: z.object({
      items: z.object({
        id: z.coerce.number().int().max(30000).min(-30000).optional(),
        name: z.string()
      }).array().transform(items => {
        // TODO: maybe > 30000
        const ids = items.map(i => i.id || 0)
        const maxId = Math.max(...ids)

        return items.map((item, index) => ({
          ...item,
          id: item.id || maxId + index + 1
        }))
      })
    })
  },
  opts => z.coerce.number().array()
)
