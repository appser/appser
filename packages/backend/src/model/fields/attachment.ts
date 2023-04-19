import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'attachment',
  {
    baseType: 'jsonb',
    optionSchema: z.object({
      isMultiple: z.boolean()
    }).partial().optional()
  },
  (opts) => z.object({
    url: z.string()
  }).array().nonempty().max(opts?.isMultiple ? 10 : 1)
)
