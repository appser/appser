import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import { policySchema } from './policy.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export const Role = Model.define('role', {
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())).primary(),
  name: column('text', z.string()),
  description: column('text', z.string().optional()),
  policies: column('jsonb', policySchema.array()),
  creatorId: column('bigint', z.string().optional()),
  orgId: column('bigint', z.string().optional()),
  appId: column('bigint', z.string().optional()),
  createdAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  updatedAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString()))
})

export type TRole = z.infer<typeof Role.schema>

declare module 'backend/model' {
  interface Models {
    role: Knex.CompositeTableType<TRole, Optional<TRole, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
