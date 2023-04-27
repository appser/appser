import { datasetError } from '../dataset.error'

import type { TDataset } from 'backend/models/dataset'

export function getViewFromDatasetById(viewId: string, dataset: TDataset) {
  const viewIndex = dataset.views.findIndex(view => view.id === viewId)
  const view = dataset.views[viewIndex]

  if (!view) throw datasetError('viewNotFound')

  return { view, viewIndex }
}
