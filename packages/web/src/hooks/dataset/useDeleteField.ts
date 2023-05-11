import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import db from 'web/vendor/db'

import { getViewQuery } from './useGetView'

type P = Parameters<typeof db.dataset.deleteField>[0]

export const useDeleteField = () => {
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const queryClient = useQueryClient()
  const datasetId = dataset?.id

  return useMutation({
    mutationFn: (p: Pick<P, 'fieldName'>) => {
      if (!datasetId) throw new Error('Dataset ID is required to delete a field')

      return db.dataset.deleteField({
        ...p,
        datasetId
      })
    },
    onSuccess: () => {
      datasetId && view?.id && queryClient.invalidateQueries(getViewQuery(datasetId, view.id))
    }
  })
}
