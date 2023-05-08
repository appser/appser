import { Field } from 'backend/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('checkbox', {
  schema: z.boolean()
})
