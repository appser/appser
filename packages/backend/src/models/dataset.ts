/**
 * store dataset metadata
 */
import { filterSchema } from 'backend/db/filter'
import { Model } from 'backend/model'
import { publicColumnConfigSchema } from 'backend/model/config'
import { z } from 'zod'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'

export const viewColumnSchema = z.object({
  width: z.number().int(),
  selected: z.boolean()
}).partial()

export const viewSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(['grid']).default('grid'),
  column: z.record(viewColumnSchema),
  /** Store column sort index. */
  columns: z.string().array().nonempty(),
  sorts: z.string().array().nonempty().default(['-id']),
  filter: filterSchema.optional(),
  stickyColumn: z.number().int().default(0)
})

export type TView = z.infer<typeof viewSchema>

export const Dataset = Model.define('dataset', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true },
  appId: { field: 'numId', isRequired: true },
  name: { field: 'simpleText' },
  pos: { field: 'number', options: { allowNegative: false, precision: 0 } },
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

export const safeDatasetSchema = Dataset.schema.refine(dataset => {
  const datasetColumns = Object.keys(dataset.column)

  return dataset.views.every(view => {
    const viewColumns = Object.keys(view.column)
    const validateColumn = viewColumns.every(c => datasetColumns.includes(c))
    const validateColumns = view.columns.every(s => viewColumns.includes(s))
    const validateSorts = view.sorts.every(s => viewColumns.includes(s.startsWith('-') ? s.slice(1) : s))
    const validateFilter = view.filter ? Object.keys(view.filter).every(f => viewColumns.includes(f)) : true
    const validateStickyColumn = view.stickyColumn <= viewColumns.length - 1

    return validateColumn && validateColumns && validateSorts && validateFilter && validateStickyColumn
  })
}, {
  message: 'dataset column, view column, sorts, filter, selects or stickyColumn is not match column'
})

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'backend/db' {
  interface Dataset {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
