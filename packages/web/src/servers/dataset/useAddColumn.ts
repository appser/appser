import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import { getDatasetQuery, getViewQuery } from 'web/servers/dataset/queries'
import db from 'web/vendor/db'

type AddColumnParams = Parameters<typeof db.dataset.addColumn>[0]

export const useAddColumn = (_datasetId?: string) => {
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const datasetId = _datasetId ?? dataset?.id

  if (!datasetId) throw new Error('Dataset ID is required to add a column')

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: AddColumnParams['requestBody']) => db.dataset.addColumn({
      datasetId,
      requestBody: {
        ...values,
        currentViewId: view?.id
      }
    }),
    onSuccess(_, value) {
      queryClient.invalidateQueries(getDatasetQuery(datasetId))
      view?.id && queryClient.invalidateQueries(getViewQuery(datasetId, view.id))
    }
  })
}
