import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetcher } from 'react-router-dom'
import { useActivateApp } from 'web/hooks/ui/useActivateApp'
import db from 'web/vendor/db'

import { getAppQuery } from './useGetApp'

export const useCreateDataset = () => {
  const queryClient = useQueryClient()
  const [app] = useActivateApp()
  const fetcher = useFetcher()
  const appId = app?.id

  return useMutation({
    mutationFn: () => {
      if (!appId) throw new Error('appId is required')

      return db.app.createDataset({
        appId
      })
    },
    onSuccess: (app, p) => {
      appId && queryClient.invalidateQueries(getAppQuery(appId))

      // return fetcher.load(`/apps/${app.id}`)
    }
  })
}
