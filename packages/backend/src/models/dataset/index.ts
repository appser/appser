import { Model } from 'backend/model'
import { column } from 'backend/model/column'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import { fieldConfigSchema } from './field.schema'
import { viewSchema } from './view.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export const Dataset = Model.define('dataset', {
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())),
  appId: column('bigint', z.string()),
  name: column('text', z.string().optional()),
  fields: column('jsonb', z.record(fieldConfigSchema).default({
    name: { type: 'simpleText' }
  })),
  views: column('jsonb', viewSchema.array().default(() => [viewSchema.parse({})])),
  createdAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString())),
  updatedAt: column('timestamp', z.string().datetime().default(() => new Date().toISOString()))
})
  .primary(['appId', 'id'])

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'backend/model' {
  interface Models {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'fields' | 'views' | 'createdAt' | 'updatedAt'>>
  }
}
