import { Field } from 'core/modules/dataset/helpers/field/field'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import { z } from 'zod'

export default Field.define('numId', {
  optionSchema: z.object({
    dynamicDefault: z.literal('snowflakeId')
  }).partial().optional(),

  schema: (opts) => {
    let s
    s = z.string()

    if (opts?.dynamicDefault === 'snowflakeId') s = s.default(() => genSnowflakeId().toString())

    return s
  }
})
