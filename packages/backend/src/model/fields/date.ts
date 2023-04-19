import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'date',
  {
    baseType: 'timestamp',
    optionSchema: z.object({
      dynamicDefault: z.literal('now'),
      // format on client
      calendar: z.enum(['gregory', 'chinese', 'hebrew', 'islamic', 'coptic', 'indian', 'ethiopic', 'iso8601', 'japanese', 'persian']),
      dateStyle: z.enum(['full', 'long', 'medium', 'short']),
      timeStyle: z.enum(['full', 'long', 'medium', 'short'])
    }).partial().optional()
  },
  (opts) => {
    let s
    s = z.string()

    if (opts?.dynamicDefault === 'now') s = s.default(() => new Date().toISOString())

    return s
  },
  {
    onGet(data, options) {
      return data ? new Date(data).valueOf().toString() : data
    }
  }
)
