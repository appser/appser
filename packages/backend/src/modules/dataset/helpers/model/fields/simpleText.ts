import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('simpleText', 'text')
  .useSchema(z.string().max(2000).trim())
