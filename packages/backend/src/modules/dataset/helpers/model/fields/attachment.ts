import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('attachment', 'jsonb')
  .useOptionSchema(
    z.object({
      isMultiple: z.boolean()
    }).partial().optional()
  )
  .useSchema(
    opts => z.object({
      url: z.string()
    }).array().nonempty().max(opts?.isMultiple ? 10 : 1)
  )
