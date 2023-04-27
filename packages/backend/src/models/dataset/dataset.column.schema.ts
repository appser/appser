import { publicColumnConfigSchema } from 'backend/model/schemas/column.config.schema'
import { z } from 'zod'

import type { Columns } from 'backend/model/schemas/column.config.schema'

export const recordModelColumn = {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true },
  creator: { field: 'numId', isRequired: true },
  lastEditor: { field: 'numId', isRequired: true },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true }
} as const

// lock these columns, they are not editable by the user
const defaultDatasetColumn = Object.entries(recordModelColumn).reduce((acc, [name, config]) => {
  acc[name] = {
    ...config,
    isLocked: true
  }

  return acc
}, {} as Columns)

export const datasetColumnSchema = z.record(publicColumnConfigSchema).default(defaultDatasetColumn as any)
