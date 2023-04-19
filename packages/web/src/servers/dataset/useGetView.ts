import { useQuery } from '@tanstack/react-query'

import { getViewQuery } from './queries'

export const useGetView = (datasetId: string, viewId: string) => useQuery(getViewQuery(datasetId, viewId))
