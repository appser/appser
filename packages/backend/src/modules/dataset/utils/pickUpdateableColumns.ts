import type { TDatasetColumnConfig } from 'backend/models/dataset/dataset.column.schema'

export function pickUpdateableColumns(datasetRecord: Record<string, TDatasetColumnConfig>) {
  return Object
    .entries(datasetRecord)
    .reduce((acc, [name, config]) => {
      if (!config.locked && !config.deletedAt) {
        acc[name] = true
      }

      return acc
    }, {} as Record<string, true>)
}
