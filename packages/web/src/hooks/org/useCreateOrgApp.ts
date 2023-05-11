import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetcher, useParams } from 'react-router-dom'
import db from 'web/vendor/db'

import { listOrgAppQuery } from './useListOrgApp'

export type UpdateAppParams = Parameters<typeof db.app.updateApp>[0]

export const useCreateOrgApp = () => {
  const { orgId } = useParams()
  const queryClient = useQueryClient()
  const fetcher = useFetcher()

  return useMutation({
    mutationFn: () => {
      if (!orgId) throw new Error('orgId is required')

      return db.org.createOrgApp({
        orgId,
        requestBody: {}
      })
    },
    onSuccess: (app) => {
      orgId && queryClient.invalidateQueries(listOrgAppQuery(orgId))

      return fetcher.load(`/apps/${app.id}`)
    }
  })
}
