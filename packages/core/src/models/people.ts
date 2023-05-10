import { Model } from 'core/db/model'
import { column } from 'core/db/model/column'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import type { Optional } from '@appser/common'
import type { Knex } from 'knex'

export const People = Model.define('people', {
  userId: column('bigint', z.string().regex(rNumId)),
  orgId: column('bigint', z.string().regex(rNumId)),
  appId: column('bigint', z.string().regex(rNumId)),
  roleId: column('bigint', z.string().regex(rNumId)),
  status: column('smallint', z.number().int().gte(0).lte(2)),
  inviterId: column('bigint', z.string().regex(rNumId).optional()),
  invitedAt: column('timestamp', z.date().default(() => new Date())),
  joinedAt: column('timestamp', z.date().optional()),
  failedAt: column('timestamp', z.date().optional()),
  failedReason: column('text', z.string().optional())
})
  .primary(['userId', 'orgId', 'appId'])

export type TPeople = z.infer<typeof People.schema>

declare module 'core/db/model' {
  interface Models {
    people: Knex.CompositeTableType<TPeople, Optional<TPeople, 'invitedAt'>>
  }
}
