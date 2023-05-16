import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import { z } from 'zod'

export default DatasetField.define('numId', {
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
