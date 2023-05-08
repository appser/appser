import { Field } from 'core/modules/dataset/helpers/field'
import { z } from 'zod'

export default Field.define('url', {
  schema: z.string().url()
})
