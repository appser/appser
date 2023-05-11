import { Model } from 'core/db/model'
import { column } from 'core/db/model/column'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import { z } from 'zod'

import type { Optional } from '@appser/common'
import type { Knex } from 'knex'

export const Record = Model.define('record', {
  datasetId: column('bigint', z.string()),
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())),
  creator: column('bigint', z.string()).relation('user', 'id', ['id', 'name', 'avatar']),
  lastEditor: column('bigint', z.string()).relation('user', 'id', ['id', 'name', 'avatar']),
  createdAt: column('timestamp', z.date().default(() => new Date())),
  updatedAt: column('timestamp', z.date().default(() => new Date())),
  data: column('jsonb', z.object({}).catchall(z.any()))
})
  .primary(['datasetId', 'id'])

export type TRecord = z.infer<typeof Record.schema>

declare module 'core/db/model' {
  interface Models {
    record: Knex.CompositeTableType<TRecord, Optional<TRecord, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
