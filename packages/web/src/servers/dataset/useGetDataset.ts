import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const getDatasetQuery = (datasetId: string) => ({
  queryKey: ['dataset', datasetId],
  queryFn: () => db.dataset.getDataset({ datasetId })
})

export const useGetDataset = (datasetId: string) => useQuery(getDatasetQuery(datasetId))
