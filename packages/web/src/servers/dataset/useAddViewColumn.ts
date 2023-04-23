import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import { getDatasetQuery, getViewQuery } from 'web/servers/dataset/queries'
import db from 'web/vendor/db'

type AddColumnParams = Parameters<typeof db.dataset.addColumn>[0]

export const useAddViewColumn = (datasetId?: string, viewId?: string) => {
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const _datasetId = datasetId ?? dataset?.id
  const _viewId = viewId ?? view?.id

  if (!_datasetId || !_viewId) throw new Error('Dataset ID or view ID is required to add a column')

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: AddColumnParams['requestBody']) => db.dataset.addViewColumn({
      datasetId: _datasetId,
      viewId: _viewId,
      requestBody: {
        ...values
      }
    }),
    onSuccess(_, value) {
      queryClient.invalidateQueries(getDatasetQuery(_datasetId))
      view?.id && queryClient.invalidateQueries(getViewQuery(_datasetId, view.id))
    }
  })
}
