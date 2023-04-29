import { Model } from 'backend/model'
import { custom } from 'backend/model/column'

import { datasetRecordSchema } from './dataset.column.schema'
import { renderDefaultView, viewSchema } from './view.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const Dataset = Model.define('dataset', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, required: true },
  appId: { field: 'numId', required: true },
  name: { field: 'simpleText' },
  column: custom(datasetRecordSchema, 'jsonb'),
  views: custom(viewSchema.array().default(() => [renderDefaultView()]), 'jsonb'),
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true }
})
  .primary(['appId', 'id'])

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'backend/model' {
  interface Models {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'column' | 'views' | 'createdAt' | 'updatedAt'>>
  }
}
