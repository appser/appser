import { useQuery } from '@tanstack/react-query'

import { getDatasetQuery } from './queries'

export const useGetDataset = (datasetId: string) => useQuery(getDatasetQuery(datasetId))
