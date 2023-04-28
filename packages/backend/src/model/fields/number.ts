import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('number', 'bigint')
  .useOptionSchema(
    z.object({
      precision: z.number().int().gte(0).lte(8).default(0),
      allowNegative: z.boolean().default(false)
    }).partial()
  )
  .useSchema(
    (opts) => {
      let s = z.number()

      if (opts.precision === 0) s = s.int()
      if (opts.allowNegative === false) s = s.nonnegative()

      return s
    }
  )
