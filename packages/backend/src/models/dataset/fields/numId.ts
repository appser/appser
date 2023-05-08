import { Field } from 'backend/modules/dataset/helpers/field'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
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
