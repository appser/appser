import { Field } from 'core/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('simpleText', {
  schema: z.string().max(2000)
})
