import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { z } from 'zod'

export default DatasetField.define('attachment', {
  optionSchema: z.object({
    isMultiple: z.boolean()
  }).partial().optional(),

  schema: opts => z.object({
    url: z.string()
  }).array().nonempty().max(opts?.isMultiple ? 10 : 1)
})
