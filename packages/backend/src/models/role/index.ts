import { Model } from 'backend/model'
import { column } from 'backend/model/column'

import { policySchema } from './policy.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const Role = Model.define('role', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, required: true },
  name: { field: 'simpleText', required: true },
  description: { field: 'simpleText' },
  policies: column(policySchema.array(), 'jsonb'),
  creatorId: { field: 'numId' },
  orgId: { field: 'numId' },
  appId: { field: 'numId' },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true }
})
  .primary('id')

export type TRole = z.infer<typeof Role.schema>

declare module 'backend/model' {
  interface Models {
    role: Knex.CompositeTableType<TRole, Optional<TRole, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
