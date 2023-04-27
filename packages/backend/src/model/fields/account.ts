import { hashSync } from 'backend/vendors/bcrypt'
import { z } from 'zod'

import { Field } from '../field'

export default Field
  .define('account', 'jsonb')
  .optionSchema(
    z.object({
      grantRoleId: z.string()
    })
  )
  .schema(
    opts => z.object({
      email: z.string().email().optional(),
      password: z.string().min(6).optional().transform((v) => v && hashSync(v)),
      roleId: z.string().default(opts.grantRoleId)
    })
  )
  .on('response', data => {
    if (data.password) data.password = '********'
  })
