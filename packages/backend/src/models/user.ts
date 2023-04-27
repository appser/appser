import { roles } from '@appser/access'
import { Model } from 'backend/model'
import { custom } from 'backend/model/column'
import { z } from 'zod'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export enum UserStatus {
  ACTIVE = 1,
  SUSPENDED = 2
}
const settingsSchema = z.object({
  timezone: z.string(),
  firstDayOfWeek: z.number().int().min(0).max(6)
}).partial()

export const User = Model.define('user', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true },
  avatar: { field: 'url' },
  name: { field: 'simpleText', isRequired: true },
  status: {
    field: 'singleSelect',
    options: {
      items: [
        { id: 1, name: UserStatus[1] },
        { id: 2, name: UserStatus[2] }
      ]
    }
  },
  account: { field: 'account', options: { grantRoleId: roles.system.user.id }, isRequired: true },
  settings: custom(settingsSchema, 'jsonb'),
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true }
})
  .primary('id')
  .on('createTable', sb => {
    sb.raw('CREATE INDEX idx_account ON public.user USING gin (account jsonb_path_ops)')
  })

export type TUser = z.infer<typeof User.schema>

declare module 'backend/model' {
  interface Models {
    user: Knex.CompositeTableType<TUser, Optional<Omit<TUser, 'account'> & { account: Partial<TUser['account']> }, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
