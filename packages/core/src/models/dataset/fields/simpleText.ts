import { Field } from 'backend/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('simpleText', {
  schema: z.string().max(2000)
})
