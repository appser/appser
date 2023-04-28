import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('date', 'timestamp')
  .useOptionSchema(
    z.object({
      dynamicDefault: z.literal('now'),
      // format on client
      calendar: z.enum(['gregory', 'chinese', 'hebrew', 'islamic', 'coptic', 'indian', 'ethiopic', 'iso8601', 'japanese', 'persian']),
      dateStyle: z.enum(['full', 'long', 'medium', 'short']),
      timeStyle: z.enum(['full', 'long', 'medium', 'short'])
    }).partial().optional()
  )
  .useSchema(
    (opts) => {
      let s
      s = z.string().refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid date' })

      if (opts?.dynamicDefault === 'now') s = s.default(() => new Date().toISOString())

      return s
    }
  )
  .on('response', data => {
    data = data ? data.valueOf().toString() : data
  })
