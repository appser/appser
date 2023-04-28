import { publicFieldColumnConfigSchema } from 'backend/model/schemas/column.config.schema'
import { z } from 'zod'

export const datasetColumnConfigSchema = publicFieldColumnConfigSchema.and(z.object({
  title: z.string().max(255).trim(),
  /**
   * When set to true, the column can only be updated its title
   */
  locked: z.boolean(),
  deletedAt: z.string()
}).partial())

export type TDatasetColumnConfig = z.infer<typeof datasetColumnConfigSchema>

export const datasetRecordSchema = z.record(datasetColumnConfigSchema)

export type TDatasetRecord = z.infer<typeof datasetRecordSchema>
