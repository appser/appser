import Field from 'backend/model/field'
import { z } from 'zod'

export default Field.define(
  'checkbox',
  {
    baseType: 'boolean'
  },
  z.boolean()
)
