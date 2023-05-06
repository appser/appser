import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import { datasetRecordSchema } from './dataset.column.schema'
import { renderDefaultView, viewSchema } from './view.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export const Dataset = Model.define('dataset', {
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())).primary(),
  appId: column('bigint', z.string()),
  name: column('text', z.string().optional()),
  // column: column('jsonb', datasetRecordSchema),
  views: column('jsonb', viewSchema.array().default(() => [renderDefaultView()])),
  createdAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  updatedAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString()))
})
  .primary(['appId', 'id'])

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'backend/model' {
  interface Models {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'column' | 'views' | 'createdAt' | 'updatedAt'>>
  }
}
