import { roles } from '@appser/access'
import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import { hashSync } from 'backend/vendors/bcrypt'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export enum UserStatus {
  ACTIVE = 1,
  SUSPENDED = 2
}

export const User = Model.define('user', {
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())).primary(),
  avatar: column('text', z.string().optional()),
  name: column('text', z.string()),
  status: column('smallint', z.number().int().gte(1).lte(2).default(UserStatus.ACTIVE)),
  account: column('jsonb', {
    email: z.string().email().optional(),
    password: z.string().min(6).optional().transform((v) => v && hashSync(v)),
    roleId: z.string().default(roles.system.user.id)
  }),
  settings: column('jsonb', z.object({
    timezone: z.string(),
    firstDayOfWeek: z.number().int().min(0).max(6)
  }).optional()),
  createdAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  updatedAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString()))
})
  .on('createTable', builder => {
    builder.raw('CREATE INDEX idx_account ON public.user USING gin (account jsonb_path_ops)')
  })

export type TUser = z.infer<typeof User.schema>

declare module 'backend/model' {
  interface Models {
    user: Knex.CompositeTableType<TUser, Optional<Omit<TUser, 'account'> & { account: Partial<TUser['account']> }, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
