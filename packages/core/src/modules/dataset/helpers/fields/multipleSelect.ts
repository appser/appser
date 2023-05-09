import { Field } from 'core/modules/dataset/helpers/field/field'
import { z } from 'zod'

export default Field.define('multipleSelect', {
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
  }),

  schema:
    opts => z.coerce.number().refine(d => opts.items.find(item => item.id === d) !== undefined, {
      message: 'Invalid option selected'
    }).array()
})
