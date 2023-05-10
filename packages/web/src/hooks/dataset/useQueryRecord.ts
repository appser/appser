import { useInfiniteQuery } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import db from 'web/vendor/db'

import type { Filter, FilterConfig } from '../../types'
import type { QueryKey } from '@tanstack/react-query'

export const queryRecordQuery = (datasetId: string, viewId: string, params?: unknown) => ({
  queryKey: ['dataset', datasetId, 'view', viewId, 'record', 'query', params]
})

export const RECORDS_PAGE_SIZE = 100

const queryKey = atom<QueryKey | null>(null)
const filter = atom<FilterConfig | null>(null)
const sorts = atom<string[]>([])

export const useCurrentRecordQueryKey = () => useAtom(queryKey)
export const useCurrentRecordFilter = () => useAtom(filter)
export const useCurrentRecordSorts = () => useAtom(sorts)

export function useQueryRecord(toDatasetId?: string, toViewId?: string) {
  const p = useParams()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const [filter] = useCurrentRecordFilter()
  const [sorts] = useCurrentRecordSorts()
  const [, setCurrentQueryKey] = useCurrentRecordQueryKey()
  const datasetId = toDatasetId ?? dataset?.id ?? p.datasetId ?? ''
  const viewId = toViewId ?? view?.id ?? p.viewId ?? ''
  const queryParamsFilter = useMemo<Filter | undefined>(() => {
    if (!filter) return

    return {
      [filter.logic]: filter.conditions
    }
  }, [filter])

  const queryParams = {
    filter: queryParamsFilter,
    sorts: sorts.length === 0 ? undefined : sorts
  }
  const queryKey = queryRecordQuery(datasetId, viewId, queryParams).queryKey

  useEffect(() => {
    setCurrentQueryKey(queryKey)

    return () => {
      setCurrentQueryKey(null)
    }
  }, [])

  if (!datasetId || !viewId) {
    throw new Error('Dataset ID and View ID are required to query records.')
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => {
      return db.dataset.queryRecord({
        datasetId,
        viewId,
        requestBody: {
          ...queryParams,
          pageSize: RECORDS_PAGE_SIZE,
          pageToken: pageParam
        }
      })
    },
    getNextPageParam: (lastPage, pages) => lastPage.pageToken
  })
}
