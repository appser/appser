import { Field } from 'backend/model/field'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

export default Field
  .define('numId', 'bigint')
  .optionSchema(
    z.object({
      dynamicDefault: z.literal('snowflakeId')
    }).partial().optional()
  )
  .schema(
    (opts) => {
      let s
      // when use `z.coerce.string()`, the zodToJsonSchema will missing that property in the required
      // The bigint type will to be responded by the knex as a string type, so Field does not need the work of casting.
      s = z.string()

      if (opts?.dynamicDefault === 'snowflakeId') s = s.default(() => genSnowflakeId().toString())

      return s
    }
  )
