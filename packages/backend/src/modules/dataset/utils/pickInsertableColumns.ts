import type { TDatasetColumnConfig } from 'backend/models/dataset/dataset.record.schema'

export function pickInsertableColumns(datasetRecord: Record<string, TDatasetColumnConfig>) {
  return Object
    .entries(datasetRecord)
    .reduce((acc, [name, config]) => {
      if (!config.deletedAt) {
        acc[name] = true
      }

      return acc
    }, {} as Record<string, true>)
}
