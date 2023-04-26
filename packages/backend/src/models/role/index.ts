import { Model } from 'backend/model'

import { policySchema } from './policy.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const Role = Model.define('role', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true },
  name: { field: 'simpleText', isRequired: true },
  description: { field: 'simpleText' },
  policies: {
    field: 'custom',
    schema: policySchema.array(),
    isRequired: true
  },
  creatorId: { field: 'numId' },
  orgId: { field: 'numId' },
  appId: { field: 'numId' },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true }
})
  .primary('id')

export type TRole = z.infer<typeof Role.schema>

declare module 'backend/db' {
  interface Dataset {
    role: Knex.CompositeTableType<TRole, Optional<TRole, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
