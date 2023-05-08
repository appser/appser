import { Field } from 'backend/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('date', {
  optionSchema: z.object({
    dynamicDefault: z.literal('now'),
    calendar: z.enum(['gregory', 'chinese', 'hebrew', 'islamic', 'coptic', 'indian', 'ethiopic', 'iso8601', 'japanese', 'persian']),
    dateStyle: z.enum(['full', 'long', 'medium', 'short']),
    timeStyle: z.enum(['full', 'long', 'medium', 'short'])
  }).partial().optional(),

  schema: (opts) => {
    let s
    s = z.string().datetime()

    if (opts?.dynamicDefault === 'now') s = s.default(() => new Date().toISOString())

    return s
  }
})
