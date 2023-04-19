import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetcher } from 'react-router-dom'
import { useActivatedApp } from 'web/hooks/useActivatedApp'
import db from 'web/vendor/db'

import { getAppQuery } from './queries'

export type UpdateAppParams = Parameters<typeof db.app.updateApp>[0]

export const useCreateDataset = () => {
  const queryClient = useQueryClient()
  const [app] = useActivatedApp()
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
      appId && queryClient.invalidateQueries(getAppQuery({ appId }))

      // return fetcher.load(`/apps/${app.id}`)
    }
  })
}
