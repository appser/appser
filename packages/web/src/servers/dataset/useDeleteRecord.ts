import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { useListRecordCurrentQueryKey } from './useQueryRecord'

export const useDeleteRecord = (datasetId: string, recordId: string) => {
  const queryClient = useQueryClient()
  const [queryKey] = useListRecordCurrentQueryKey()

  return useMutation({
    mutationFn: async () => {
      return db.dataset.deleteRecord({
        datasetId,
        recordId
      })
    },
    onSuccess() {
      queryKey && queryClient.invalidateQueries({ queryKey })
    }
  })
}
