import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { z } from 'zod'

export default DatasetField.define('date', {
  optionSchema: z.object({
    dynamicDefault: z.literal('now'),
    calendar: z.enum(['gregory', 'chinese', 'hebrew', 'islamic', 'coptic', 'indian', 'ethiopic', 'iso8601', 'japanese', 'persian']),
    dateStyle: z.enum(['full', 'long', 'medium', 'short']),
    timeStyle: z.enum(['full', 'long', 'medium', 'short'])
  }).partial().optional(),

  schema: (opts) => {
    let s
    s = z.number().nullable()

    if (opts?.dynamicDefault === 'now') s = s.default(() => new Date().valueOf())

    return s
  }
})
