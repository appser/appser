import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'richText',
  {
    baseType: 'text'
  },
  (opt = {}) => {
    const s = z.string().max(65_535)

    return s
  }
)
