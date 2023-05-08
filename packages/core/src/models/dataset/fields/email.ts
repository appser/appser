import { Field } from 'backend/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('email', {
  schema: z.string().email()
})
