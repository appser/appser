import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { getDatasetQuery } from './useGetDataset'

export type P = Parameters<typeof db.dataset.updateField>[0]

export const useUpdateField = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: P) => db.dataset.updateField(values),
    onSuccess(_, values) {
      queryClient.invalidateQueries({
        ...getDatasetQuery(values.datasetId),
        exact: true
      })
    }
  })
}
