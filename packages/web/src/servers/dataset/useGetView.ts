import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const getViewQuery = (datasetId: string, viewId: string) => ({
  queryKey: ['dataset', datasetId, 'view', viewId],
  queryFn: () => db.dataset.getView({ datasetId, viewId })
})

export const useGetView = (datasetId: string, viewId: string) => useQuery(getViewQuery(datasetId, viewId))
