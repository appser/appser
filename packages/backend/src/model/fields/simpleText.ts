import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'simpleText',
  {
    baseType: 'text',
    optionSchema: z.object({
      default: z.string()
    }).partial().optional()
  },
  (opt = {}) => {
    let s
    s = z.string().max(255)

    if (opt.default) s = s.default(opt.default)

    return s
  }
)
