import { Model, column } from 'backend/model'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import type { Optional } from '@appser/common'
import type { Knex } from 'knex'

export const Org = Model.define('org', {
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())).primary(),
  name: column('text', z.string().trim()),
  image: column('text', z.string().url().optional()),
  creatorId: column('bigint', z.string()).relation('user', 'id', ['name', 'id']),
  createdAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  updatedAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString()))
})

export type TOrg = z.infer<typeof Org.schema>

declare module 'backend/model' {
  interface Models {
    org: Knex.CompositeTableType<TOrg, Optional<TOrg, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
