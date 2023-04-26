import { Model } from 'backend/model'
import { publicColumnConfigSchema } from 'backend/model/config'
import { z } from 'zod'

import { viewSchema } from './view.schema'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export const Dataset = Model.define('dataset', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true },
  appId: { field: 'numId', isRequired: true },
  name: { field: 'simpleText' },
  column: {
    field: 'custom',
    schema: z.record(publicColumnConfigSchema),
    isRequired: true
  },
  views: {
    field: 'custom',
    schema: viewSchema.array(),
    isRequired: true
  },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true }
})
  .primary(['appId', 'id'])

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'backend/db' {
  interface Dataset {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
