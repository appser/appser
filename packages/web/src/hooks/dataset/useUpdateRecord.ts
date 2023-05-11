import { useMutation, useQueryClient } from '@tanstack/react-query'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import db from 'web/vendor/db'

import { useCurrentRecordQueryKey } from './useQueryViewRecord'
import { useActivatedDataset } from '../useActivatedDataset'

import type { InfiniteData } from '@tanstack/react-query'
import type { Row } from 'web/components/views/SheetView/row/Row'

interface MutationParams {
  id: string
  fields: Record<string, unknown>
  optimisticUpdateRow?: Row
}

type QueryRecordResponse = Awaited<ReturnType<typeof db.dataset.queryViewRecord>>

export function useUpdateRecord(fromDatasetId?: string) {
  const queryClient = useQueryClient()
  const [queryKey] = useCurrentRecordQueryKey()
  const [dataset] = useActivatedDataset()
  const datasetId = fromDatasetId ?? dataset?.id

  return useMutation({
    mutationFn: async ({ id, fields, optimisticUpdateRow: row }: MutationParams) => {
      if (!datasetId) throw new Error('dataset id  is required when update a record')

      return db.dataset.updateRecord({
        datasetId,
        recordId: id,
        requestBody: fields
      })
    },
    onMutate: async ({ fields, optimisticUpdateRow: row }) => {
      if (!queryKey || !row) return

      row.record = {
        ...row.record,
        ...fields
      }

      await queryClient.cancelQueries({ queryKey })
      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData(queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData<InfiniteData<QueryRecordResponse>>(
        queryKey,
        data => {
          if (!data) return data

          const ret = cloneDeep(data)

          ret.pages[row.pageIndex].records[row.recordIndex] = merge(
            ret.pages[row.pageIndex].records[row.recordIndex],
            row.record
          )

          return ret
        }
      )

      return { previousRecords }
    },
    // eslint-disable-next-line n/handle-callback-err
    onError(error, row, context) {
      queryKey && queryClient.setQueryData(queryKey, context?.previousRecords)
    },
    onSettled: () => {
      //  queryClient.invalidateQueries({ queryKey, refetchType: 'none' })
    }
  })
}
