import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import db from 'web/vendor/db'

import { getDatasetQuery } from './useGetDataset'
import { getViewQuery } from './useGetView'

type P = Parameters<typeof db.dataset.addField>[0]

export const useAddField = (toDatasetId?: string, toViewId?: string) => {
  const queryClient = useQueryClient()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const datasetId = toDatasetId ?? dataset?.id
  const viewId = toViewId ?? view?.id

  return useMutation({
    mutationFn: (values: P['requestBody']) => {
      if (!datasetId || !viewId) throw new Error('Dataset ID or view ID is required to add a field')

      return db.dataset.addField({
        datasetId,
        requestBody: {
          ...values,
          appendViewId: viewId
        }
      })
    },
    onSuccess(_, value) {
      datasetId && queryClient.invalidateQueries(getDatasetQuery(datasetId))
      datasetId && viewId && queryClient.invalidateQueries(getViewQuery(datasetId, viewId))
    }
  })
}
