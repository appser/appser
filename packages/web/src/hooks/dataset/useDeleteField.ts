import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivateDataset } from 'web/hooks/ui/useActivateDataset'
import { useActivateView } from 'web/hooks/ui/useActivateView'
import db from 'web/vendor/db'

import { getViewQuery } from './useGetView'

type P = Parameters<typeof db.dataset.deleteField>[0]

export const useDeleteField = () => {
  const [dataset] = useActivateDataset()
  const [view] = useActivateView()
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
