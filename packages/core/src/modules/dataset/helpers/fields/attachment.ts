import { Field } from 'core/modules/dataset/helpers/field/field'
import { z } from 'zod'

export default Field.define('attachment', {
  optionSchema: z.object({
    isMultiple: z.boolean()
  }).partial().optional(),

  schema: opts => z.object({
    url: z.string()
  }).array().nonempty().max(opts?.isMultiple ? 10 : 1)
})
