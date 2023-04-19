import db from 'web/vendor/db'

export const getDatasetQuery = (datasetId: string) => ({
  queryKey: ['dataset', datasetId],
  queryFn: () => db.dataset.getDataset({ datasetId })
})

export const getViewQuery = (datasetId: string, viewId: string) => ({
  queryKey: ['dataset', datasetId, 'view', viewId],
  queryFn: () => db.dataset.getView({ datasetId, viewId })
})

export const listRecordQuery = (datasetId: string, viewId: string, params?: unknown) => ({
  queryKey: ['dataset', datasetId, 'view', viewId, 'records', params]
})
