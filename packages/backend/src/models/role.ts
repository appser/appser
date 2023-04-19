import { Model } from 'backend/model'
import { z } from 'zod'

import type { Policy } from '@appser/access'
import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { Schema } from 'zod'

export const policySchema: Schema<Policy> = z.object({
  action: z.union([z.string(), z.string().array()]),
  resource: z.object({}).catchall(z.string().or(z.string().array())),
  attributes: z.string().array().optional(),
  effect: z.enum(['allow', 'deny']).optional(),
  role: z.coerce.string().optional()
})

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
