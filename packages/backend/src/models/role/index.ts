import { Model } from 'backend/model'
import { custom } from 'backend/model/column'

import { policySchema } from './policy.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const Role = Model.define('role', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true },
  name: { field: 'simpleText', isRequired: true },
  description: { field: 'simpleText' },
  policies: custom(policySchema.array(), 'jsonb'),
  creatorId: { field: 'numId' },
  orgId: { field: 'numId' },
  appId: { field: 'numId' },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true }
})
  .primary('id')

export type TRole = z.infer<typeof Role.schema>

declare module 'backend/model' {
  interface Models {
    role: Knex.CompositeTableType<TRole, Optional<TRole, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
