import { Model } from 'backend/model'
import jsonSchema from 'backend/utils/jsonSchema'

import { defaultPublicRecordColumn } from './dataset/dataset.column.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const Record = Model.define('record', {
  datasetId: { field: 'numId', isRequired: true },
  ...defaultPublicRecordColumn,
  extra: { field: 'custom', schema: jsonSchema }
})
  .primary(['datasetId', 'id'])

export type TRecord = z.infer<typeof Record.schema>

declare module 'backend/model' {
  interface Models {
    record: Knex.CompositeTableType<TRecord, Optional<TRecord, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
