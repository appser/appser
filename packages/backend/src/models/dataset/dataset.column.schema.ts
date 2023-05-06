import { publicFieldColumnConfigSchema } from 'backend/modules/dataset/helpers/model/schemas/column.config.schema'
import { z } from 'zod'

export const datasetColumnConfigSchema = publicFieldColumnConfigSchema.and(z.object({
  title: z.string().max(255).trim(),
  /**
   * Shared to client, the server does not care about this
   */
  locked: z.boolean(),
  deletedAt: z.string()
}).partial())

export type TDatasetColumnConfig = z.infer<typeof datasetColumnConfigSchema>

export const datasetRecordSchema = z.record(datasetColumnConfigSchema)

export type TDatasetRecord = z.infer<typeof datasetRecordSchema>
