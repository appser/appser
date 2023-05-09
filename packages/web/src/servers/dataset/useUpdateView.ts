import { useMutation, useQueryClient } from '@tanstack/react-query'
import { merge } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'
import db from 'web/vendor/db'

import { getViewQuery } from './useGetView'
import { useActivatedView } from '../../hooks/useActivatedView'

import type { TView } from './types'

export type UpdateViewParams = Parameters<typeof db.dataset.updateView>[0]

export const useUpdateView = () => {
  const queryClient = useQueryClient()
  const [view] = useActivatedView()
  const viewQuery = view && getViewQuery(view.datasetId, view.id)

  return useMutation({
    mutationFn: (p: UpdateViewParams['requestBody']) => {
      if (!view) return Promise.reject(new Error('View is not activated'))

      return db.dataset.updateView({
        datasetId: view.datasetId,
        viewId: view.id,
        requestBody: p
      })
    },
    onMutate: async (body) => {
      if (!viewQuery) return

      await queryClient.cancelQueries(viewQuery)
      // Snapshot the previous value
      const previousView = queryClient.getQueryData(viewQuery.queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData<TView>(
        viewQuery.queryKey,
        data => {
          if (!data) return data

          const ret = merge(cloneDeep(data), body)

          return ret
        }
      )

      return { previousView }
    },
    // eslint-disable-next-line n/handle-callback-err
    onError(error, row, context) {
      viewQuery?.queryKey && queryClient.setQueryData(viewQuery.queryKey, context?.previousView)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: viewQuery?.queryKey, refetchType: 'none' })
    }
    // onSuccess(_, values) {
    //   queryClient.invalidateQueries({
    //     ...datasetQuery(values.datasetId),
    //     exact: true
    //   })
    // }
  })
}
