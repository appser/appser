import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import { getDatasetQuery, getViewQuery } from 'web/servers/dataset/queries'
import db from 'web/vendor/db'

type DeleteColumnParams = Parameters<typeof db.dataset.deleteColumn>[0]

export const useDeleteColumn = () => {
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const queryClient = useQueryClient()

  if (!dataset?.id) throw new Error('Dataset ID is required to delete a column')

  return useMutation({
    mutationFn: (p: Pick<DeleteColumnParams, 'fieldName'>) => db.dataset.deleteColumn({
      ...p,
      datasetId: dataset.id
    }),
    onSuccess: () => {
      //  dataset.id && queryClient.invalidateQueries({ ...getDatasetQuery(dataset.id), exact: true })
      view?.id && queryClient.invalidateQueries(getViewQuery(dataset.id, view.id))
    }
  })
}
