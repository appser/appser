import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { useCurrentRecordQueryKey } from './useQueryViewRecord'

type Params = Parameters<typeof db.dataset.addRecord>[0]

export const useAddRecord = (datasetId: string) => {
  const queryClient = useQueryClient()
  const [queryKey] = useCurrentRecordQueryKey()

  return useMutation({
    mutationFn: async (b: Params['requestBody']) => {
      return await db.dataset.addRecord({
        datasetId,
        requestBody: b
      })
    },
    onSuccess: (data, v) => {
      queryKey && queryClient.invalidateQueries({ queryKey })
    }
  })
}
