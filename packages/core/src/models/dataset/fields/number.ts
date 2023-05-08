import { Field } from 'backend/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('number', {
  optionSchema: z.object({
    precision: z.number().int().gte(0).lte(8).default(0),
    allowNegative: z.boolean().default(false)
  }).partial(),

  schema: (opts) => {
    let s = z.number()

    if (opts.precision === 0) s = s.int()
    if (opts.allowNegative === false) s = s.nonnegative()

    return s
  }
})
