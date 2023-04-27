import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('richText', 'text')
  .schema(z.string().max(65_535))
