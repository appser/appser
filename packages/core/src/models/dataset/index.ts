import { Model } from 'core/db/model'
import { column } from 'core/db/model/column'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import { z } from 'zod'

import { datasetFieldSchema } from './field.schema'
import { viewSchema } from '../../modules/dataset/helpers/view/view.schema'

import type { Optional } from '@appser/common'
import type { Knex } from 'knex'

export const Dataset = Model.define('dataset', {
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())),
  appId: column('bigint', z.string()),
  name: column('text', z.string().optional()),
  field: column('jsonb', z.record(datasetFieldSchema).default({
    name: { type: 'simpleText' }
  })),
  views: column('jsonb', viewSchema.array().default(() => [viewSchema.parse({})])),
  createdAt: column('timestamp', z.date().default(() => new Date())),
  updatedAt: column('timestamp', z.date().default(() => new Date()))
})
  .primary(['appId', 'id'])

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'core/db/model' {
  interface Models {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'field' | 'views' | 'createdAt' | 'updatedAt'>>
  }
}
