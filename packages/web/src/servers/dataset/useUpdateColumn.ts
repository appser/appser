import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { getDatasetQuery } from './useGetDataset'

export type UpdateColumnParams = Parameters<typeof db.dataset.updateColumn>[0]

export const useUpdateColumn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UpdateColumnParams) => db.dataset.updateColumn(values),
    onSuccess(_, values) {
      queryClient.invalidateQueries({
        ...getDatasetQuery(values.datasetId),
        exact: true
      })
    }
  })
}
