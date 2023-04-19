import Field from 'backend/model/field'
import { hashSync } from 'backend/vendors/bcrypt'
import { z } from 'zod'

export default Field.define(
  'account',
  {
    baseType: 'jsonb',
    optionSchema: z.object({
      grantRoleId: z.string()
    })
  },
  (opts) => z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional().transform((v) => v && hashSync(v)),
    roleId: z.string().default(opts.grantRoleId)
  }),
  {
    onGet(data, options) {
      if (data.password) data.password = '********'

      return data
    }
  }
)
