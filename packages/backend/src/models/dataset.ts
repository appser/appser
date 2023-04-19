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
  width: z.number().int().optional()
})

export const unsafeViewSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(['grid']).default('grid'),
  column: z.record(viewColumnSchema),
  sorts: z.string().array().nonempty().default(['-id']),
  filter: filterSchema.optional(),
  /** If you want to hide a column, use a '-' at the beginning of its name., eg. '-name' */
  selects: z.string().array().nonempty(),
  stickyColumn: z.number().int().default(0)
})

export const viewSchema = unsafeViewSchema.refine(
  obj => {
    const availableColumns = Object.keys(obj.column)
    const validateSorts = obj.sorts.every(s => availableColumns.includes(s.startsWith('-') ? s.slice(1) : s))
    const validateFilter = obj.filter ? Object.keys(obj.filter).every(f => availableColumns.includes(f)) : true
    const validateSelects = obj.selects.every(s => availableColumns.includes(s.startsWith('-') ? s.slice(1) : s))
    const validateStickyColumn = obj.stickyColumn <= availableColumns.length - 1

    return validateSorts && validateFilter && validateSelects && validateStickyColumn
  },
  {
    message: 'sorts, filter, selects or stickyColumn is not match column'
  }
)

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

export type TDataset = z.infer<typeof Dataset.schema>

declare module 'backend/db' {
  interface Dataset {
    dataset: Knex.CompositeTableType<TDataset, Optional<TDataset, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
