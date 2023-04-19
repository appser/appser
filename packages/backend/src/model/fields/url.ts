import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'url',
  {
    baseType: 'text'
  },
  z.string().url().max(2000)
)
