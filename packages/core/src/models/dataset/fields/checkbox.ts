import { Field } from 'core/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('checkbox', {
  schema: z.boolean()
})
