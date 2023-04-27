import { publicColumnConfigSchema } from 'backend/model/config'
import { z } from 'zod'

export const defaultPublicRecordColumn = {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true },
  creator: { field: 'numId', isRequired: true },
  lastEditor: { field: 'numId', isRequired: true },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true }
} as const

export const datasetColumnSchema = z.record(publicColumnConfigSchema).default(defaultPublicRecordColumn)
