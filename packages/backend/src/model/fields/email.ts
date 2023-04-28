import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('email', 'text')
  .useSchema(z.string().email().max(255))
