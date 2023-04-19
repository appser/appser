import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { useListRecordCurrentQueryKey } from './useQueryRecord'

type Params = Parameters<typeof db.dataset.addRecord>[0]

export const useAddRecord = (datasetId: string, viewId: string) => {
  const queryClient = useQueryClient()
  const [queryKey] = useListRecordCurrentQueryKey()

  return useMutation({
    mutationFn: async (d: Params['requestBody']) => {
      return await db.dataset.addRecord({
        datasetId,
        viewId,
        requestBody: d
      })
    },
    onSuccess: (data, v) => {
      queryKey && queryClient.invalidateQueries({ queryKey })
    }
  })
}
