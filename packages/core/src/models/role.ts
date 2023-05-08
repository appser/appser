import { Model } from 'core/model'
import { column } from 'core/model/column'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import { z } from 'zod'

import type { Policy } from '@appser/access'
import type { Optional } from '@appser/common'
import type { Knex } from 'knex'
import type { Schema } from 'zod'

const policySchema: Schema<Policy> = z.object({
  action: z.union([z.string(), z.string().array()]),
  resource: z.object({}).catchall(z.string().or(z.string().array())),
  attributes: z.string().array().optional(),
  effect: z.enum(['allow', 'deny']).optional(),
  role: z.coerce.string().optional()
})

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

declare module 'core/model' {
  interface Models {
    role: Knex.CompositeTableType<TRole, Optional<TRole, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
