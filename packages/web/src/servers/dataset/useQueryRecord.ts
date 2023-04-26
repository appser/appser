import { useInfiniteQuery } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import db from 'web/vendor/db'

import { listRecordQuery } from './queries'

import type { QueryKey } from '@tanstack/react-query'

export type QueryRecordParameters = Parameters<typeof db.dataset.queryRecord>[0]
export type Filter = NonNullable<QueryRecordParameters['requestBody']['filter']>
export type FilterContext = {
  logic: 'and' | 'or'
  conditions: FilterCondition[]
}
export type FilterCondition = NonNullable<Filter[keyof Filter]>[number]
export type FilterConditionValue = FilterCondition[string]
export type FilterConditionOperator = keyof FilterConditionValue
export type FilterConditionValueDetail = {
  operator: FilterConditionOperator
  value: FilterConditionValue[FilterConditionOperator]
}

export const RECORDS_PAGE_SIZE = 100

const queryKey = atom<QueryKey | null>(null)
const filter = atom<FilterContext | null>(null)
const sorts = atom<string[]>([])

export const useCurrentRecordQueryKey = () => useAtom(queryKey)
export const useCurrentRecordFilter = () => useAtom(filter)
export const useCurrentRecordSorts = () => useAtom(sorts)

export function useQueryRecord(datasetId?: string, viewId?: string) {
  const p = useParams()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const [filter] = useCurrentRecordFilter()
  const [sorts] = useCurrentRecordSorts()
  const [, setCurrentQueryKey] = useCurrentRecordQueryKey()
  const _datasetId = datasetId ?? dataset?.id ?? p.datasetId ?? ''
  const _viewId = viewId ?? view?.id ?? p.viewId ?? ''
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
  const queryKey = listRecordQuery(_datasetId, _viewId, queryParams).queryKey

  useEffect(() => {
    setCurrentQueryKey(queryKey)

    return () => {
      setCurrentQueryKey(null)
    }
  }, [])

  if (!_datasetId || !_viewId) {
    throw new Error('Dataset ID and View ID are required to query records.')
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => {
      return db.dataset.queryRecord({
        datasetId: _datasetId,
        viewId: _viewId,
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
