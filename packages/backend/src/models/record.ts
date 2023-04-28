import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import jsonSchema from 'backend/utils/jsonSchema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const publicRecordColumns = {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, required: true },
  creator: { field: 'numId', required: true },
  lastEditor: { field: 'numId', required: true },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true }
} as const

export const Record = Model.define('record', {
  datasetId: { field: 'numId', required: true },
  ...publicRecordColumns,
  extra: column(jsonSchema, 'jsonb')
})
  .primary(['datasetId', 'id'])

export type TRecord = z.infer<typeof Record.schema>

declare module 'backend/model' {
  interface Models {
    record: Knex.CompositeTableType<TRecord, Optional<TRecord, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
