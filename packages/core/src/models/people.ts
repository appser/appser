import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import type { Optional } from '@appser/common'
import type { Knex } from 'knex'

export enum PersonStatus {
  PENDING = 0,
  ACTIVE = 1,
  FAILED = 2
}

export const People = Model.define('people', {
  userId: column('bigint', z.string().regex(rNumId)),
  orgId: column('bigint', z.string().regex(rNumId)),
  appId: column('bigint', z.string().regex(rNumId)),
  roleId: column('bigint', z.string().regex(rNumId)),
  status: column('smallint', z.number().int().gte(0).lte(2)),
  inviterId: column('bigint', z.string().regex(rNumId).optional()),
  invitedAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  joinedAt: column('timestamp', z.string().datetime().optional()),
  failedAt: column('timestamp', z.string().datetime().optional()),
  failedReason: column('text', z.string().optional())
})
  .primary(['userId', 'orgId', 'appId'])

export type TPeople = z.infer<typeof People.schema>

declare module 'backend/model' {
  interface Models {
    people: Knex.CompositeTableType<TPeople, Optional<TPeople, 'invitedAt'>>
  }
}
