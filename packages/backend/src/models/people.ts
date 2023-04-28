import { Model } from 'backend/model'

import type { Optional, ValuesType } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const PersonStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  FAILED: 'failed'
} as const

export const personStatus = Object.values(PersonStatus) as [ValuesType<typeof PersonStatus>, ...ValuesType<typeof PersonStatus>[]]

export const People = Model.define('people', {
  userId: { field: 'numId', required: true },
  orgId: { field: 'numId', required: true },
  appId: { field: 'numId', required: true },
  roleId: { field: 'numId', required: true },
  status: { field: 'simpleText', required: true },
  inviterId: { field: 'numId' },
  invitedAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true },
  joinedAt: { field: 'date', required: true },
  failedAt: { field: 'date' },
  failedReason: { field: 'simpleText' }
})
  .primary(['userId', 'orgId', 'appId'])

export type TPeople = z.infer<typeof People.schema>

declare module 'backend/model' {
  interface Models {
    people: Knex.CompositeTableType<TPeople, Optional<TPeople, 'invitedAt'>>
  }
}
