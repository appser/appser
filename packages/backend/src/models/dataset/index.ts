import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import { publicColumnConfigSchema } from 'backend/model/schemas/column.config.schema'
import { z } from 'zod'

import { renderDefaultView, viewSchema } from './view.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export const Dataset = Model.define('dataset', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, required: true },
  appId: { field: 'numId', required: true },
  name: { field: 'simpleText' },
  record: column(z.record(publicColumnConfigSchema), 'jsonb'),
  views: column(viewSchema.array().default(() => [renderDefaultView()]), 'jsonb'),
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true }
})
  .primary(['appId', 'id'])

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'backend/model' {
  interface Models {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'record' | 'views' | 'createdAt' | 'updatedAt'>>
  }
}
