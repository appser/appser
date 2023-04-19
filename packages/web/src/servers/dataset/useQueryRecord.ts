import { useInfiniteQuery } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { isPlainObject, mergeWith } from 'lodash'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import db from 'web/vendor/db'

import { listRecordQuery } from './queries'
import { useActivatedDataset } from '../../hooks/useActivatedDataset'
import { useActivatedView } from '../../hooks/useActivatedView'

import type { QueryKey } from '@tanstack/react-query'

export type QueryRecordParameters = Parameters<typeof db.dataset.queryRecord>[0]
export type Filter = QueryRecordParameters['requestBody']['filter']
export type FilterCondition = Filter[keyof Filter]
export type FilterConditionOperator = keyof NonNullable<FilterCondition>[number][keyof NonNullable<FilterCondition>[number]]
export type FilterConditionItem<O extends FilterConditionOperator = FilterConditionOperator> = {
  operator: O
  value: NonNullable<FilterCondition>[number][keyof NonNullable<FilterCondition>[number]][O]
}

export const RECORDS_PAGE_SIZE = 100

const currentQueryKey = atom<QueryKey | null>(null)
const filters = atom<Filter[]>([])
const sorts = atom<string[]>([])

export const useListRecordCurrentQueryKey = () => useAtom(currentQueryKey)

export const useRecordsFilters = () => useAtom(filters)

export const useRecordsSorts = () => useAtom(sorts)

function mergeFilters(objValue: unknown, srcValue: unknown): unknown {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  } else if (isPlainObject(objValue)) {
    return mergeWith(objValue, srcValue, mergeFilters)
  } else {
    return objValue ? [objValue, srcValue] : srcValue
  }
}

export function useQueryRecord(datasetId?: string, viewId?: string) {
  const p = useParams()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const [filters] = useRecordsFilters()
  const [sorts] = useRecordsSorts()
  const [, setCurrentQueryKey] = useListRecordCurrentQueryKey()
  const _datasetId = datasetId ?? dataset?.id ?? p.datasetId ?? ''
  const _viewId = viewId ?? view?.id ?? p.viewId ?? ''
  const filter = mergeWith({}, ...filters, mergeFilters)
  const params = {
    filter,
    sorts
  }
  const queryKey = listRecordQuery(_datasetId, _viewId, params).queryKey

  useEffect(() => {
    setCurrentQueryKey(queryKey)

    return () => {
      setCurrentQueryKey(null)
    }
  }, [])

  if (!_datasetId || !_viewId) {
    throw new Error('Dataset ID and View ID are required to list records')
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => {
      return db.dataset.queryRecord({
        datasetId: _datasetId,
        viewId: _viewId,
        requestBody: {
          ...params,
          pageSize: RECORDS_PAGE_SIZE,
          pageToken: pageParam
        }
      })
    },
    getNextPageParam: (lastPage, pages) => lastPage.pageToken
  })
}
