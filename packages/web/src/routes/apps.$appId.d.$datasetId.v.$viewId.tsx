import { Loader } from '@appser/ui'
import React, { Suspense, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Forbidden } from 'web/components/errors/Forbidden'
import { NotFound } from 'web/components/errors/NotFound'
import { loadQueryData } from 'web/helpers/loadQueryData'
import { getViewQuery, useGetView } from 'web/hooks/dataset/useGetView'
import { useActivatedView } from 'web/hooks/useActivatedView'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

const SheetView = React.lazy(() => import('web/components/views/SheetView'))

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { datasetId = '', viewId = '' } = params
  loadQueryData(queryClient, getViewQuery(datasetId, viewId))

  return null
}

export default function AppsIdViewsId() {
  const { viewId = '', datasetId = '' } = useParams()
  const [, setActivatedView] = useActivatedView()
  const { data: view, isLoading, isSuccess } = useGetView(datasetId, viewId)

  useEffect(() => {
    view && setActivatedView(view)

    return () => setActivatedView(null)
  }, [view])

  if (isLoading) return <Loader />

  if (isSuccess) {
    if (!view) return <NotFound />

    if (view.type === 'sheet') {
      return (
        <Suspense fallback="loading">
          <SheetView view={view} />
        </Suspense>
      )
    }
  }

  return <Forbidden />
}
