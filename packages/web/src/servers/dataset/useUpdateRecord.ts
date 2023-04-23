import { useMutation, useQueryClient } from '@tanstack/react-query'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import db from 'web/vendor/db'

import { useCurrentRecordQueryKey } from './useQueryRecord'

import type { InfiniteData } from '@tanstack/react-query'
import type { Row } from 'web/components/views/GridView/row/Row'
import type { ListRecord } from 'web/types'

export function useUpdateRecord(datasetId: string, viewId: string) {
  const queryClient = useQueryClient()
  const [queryKey] = useCurrentRecordQueryKey()

  return useMutation({
    mutationFn: async (row: Row) => {
      const { id, ...fields } = row.record

      return db.dataset.updateRecord({
        datasetId,
        viewId,
        recordId: id,
        requestBody: fields
      })
    },
    onMutate: async (row) => {
      if (!queryKey) return

      await queryClient.cancelQueries({ queryKey })
      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData(queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData<InfiniteData<ListRecord>>(
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
