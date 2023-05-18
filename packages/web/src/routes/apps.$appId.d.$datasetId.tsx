import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getDatasetQuery, useGetDataset } from 'web/hooks/dataset/useGetDataset'
import { useActivateDataset } from 'web/hooks/ui/useActivateDataset'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { datasetId = '' } = params
  queryClient.prefetchQuery(getDatasetQuery(datasetId))

  return null
}

export default function AppsIdDatasetId() {
  const { datasetId = '' } = useParams()
  const [, setActivatedDataset] = useActivateDataset()
  const { data: dataset } = useGetDataset(datasetId)

  useEffect(() => {
    setActivatedDataset(dataset)

    return () => setActivatedDataset(undefined)
  }, [dataset])

  return <Outlet />
}
