import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetcher, useParams } from 'react-router-dom'
import { listOrgAppQuery } from 'web/servers/org/queries'
import db from 'web/vendor/db'

export type UpdateAppParams = Parameters<typeof db.app.updateApp>[0]

export const useCreateOrgApp = () => {
  const { orgId } = useParams()
  const queryClient = useQueryClient()
  const fetcher = useFetcher()

  if (!orgId) throw new Error('orgId is required')

  return useMutation({
    mutationFn: () => {
      return db.org.createOrgApp({
        orgId,
        requestBody: {}
      })
    },
    onSuccess: (app) => {
      orgId && queryClient.invalidateQueries(listOrgAppQuery({ orgId }))

      return fetcher.load(`/apps/${app.id}`)
    }
  })
}
