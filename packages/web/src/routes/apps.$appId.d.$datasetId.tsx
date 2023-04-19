import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { getDatasetQuery } from 'web/servers/dataset/queries'
import { useGetDataset } from 'web/servers/dataset/useGetDataset'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { datasetId = '' } = params
  queryClient.prefetchQuery(getDatasetQuery(datasetId))

  return null
}

export default function AppsIdDatasetId() {
  const { datasetId = '' } = useParams()
  const [, setActivatedDataset] = useActivatedDataset()
  const { data: dataset } = useGetDataset(datasetId)

  useEffect(() => {
    setActivatedDataset(dataset)

    return () => setActivatedDataset(undefined)
  }, [dataset])

  return <Outlet />
}
