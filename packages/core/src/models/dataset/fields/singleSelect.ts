import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { z } from 'zod'

export const optionSchema = z.object({
  items: z.object({
    id: z.string().optional(),
    name: z.string()
  }).array().transform(items => {
    const ids = items.map(i => Number(i.id) || 0)
    const maxId = Math.max(...ids)

    return items.map((item, index) => ({
      ...item,
      id: String(item.id || maxId + index + 1)
    }))
  })
})

export default DatasetField.define('singleSelect', {
  optionSchema,

  schema: opts => z.string()
    .refine(d => opts!.items.find(item => item.id === d) !== undefined, {
      message: 'Invalid option selected'
    })
})
