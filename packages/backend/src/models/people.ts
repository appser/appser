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
  userId: { field: 'numId', isRequired: true },
  orgId: { field: 'numId', isRequired: true },
  appId: { field: 'numId', isRequired: true },
  roleId: { field: 'numId', isRequired: true },
  status: { field: 'simpleText', isRequired: true },
  inviterId: { field: 'numId' },
  invitedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  joinedAt: { field: 'date', isRequired: true },
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
