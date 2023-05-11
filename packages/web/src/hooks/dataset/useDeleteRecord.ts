import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { useCurrentRecordQueryKey } from './useQueryViewRecord'

export const useDeleteRecord = (datasetId: string, recordId: string) => {
  const queryClient = useQueryClient()
  const [queryKey] = useCurrentRecordQueryKey()

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
