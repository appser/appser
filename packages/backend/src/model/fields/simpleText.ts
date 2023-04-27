import { Field } from 'backend/model/field'
import { z } from 'zod'

export default Field
  .define('simpleText', 'text')
  .schema(z.number())
