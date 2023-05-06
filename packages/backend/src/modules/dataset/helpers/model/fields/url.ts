import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('url', 'text')
  .useSchema(z.string().url().max(2000))
