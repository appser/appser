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

  if (!dataset?.id) throw new Error('Dataset ID is required to delete a field')

  return useMutation({
    mutationFn: (p: Pick<P, 'fieldName'>) => db.dataset.deleteField({
      ...p,
      datasetId: dataset.id
    }),
    onSuccess: () => {
      view?.id && queryClient.invalidateQueries(getViewQuery(dataset.id, view.id))
    }
  })
}
