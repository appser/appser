import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('email', 'text')
  .schema(z.string().email().max(255))
