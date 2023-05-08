import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import type { Optional } from '@appser/common'
import type { Knex } from 'knex'

export const Record = Model.define('record', {
  datasetId: column('bigint', z.string()),
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())),
  creator: column('bigint', z.string()).relation('user', 'id', ['id', 'name', 'avatar']),
  lastEditor: column('bigint', z.string()).relation('user', 'id', ['id', 'name', 'avatar']),
  createdAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  updatedAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  data: column('jsonb', z.any())
})
  .primary(['datasetId', 'id'])

export type TRecord = z.infer<typeof Record.schema>

declare module 'backend/model' {
  interface Models {
    record: Knex.CompositeTableType<TRecord, Optional<TRecord, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
