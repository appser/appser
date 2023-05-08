import { Field } from 'backend/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('relation', {
  optionSchema: z.object({
    table: z.string(),
    selects: z.string().array(),
    referenceKey: z.string().optional().default('id'),
    isMultiple: z.boolean().optional()
  }),

  schema: opts => z.string().array().nonempty().max(opts?.isMultiple ? 500 : 1)
})
