import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivatedOrg } from 'web/hooks/useActivatedOrg'
import db from 'web/vendor/db'

import { listOrgAppQuery } from '../org/queries'

export type DeleteAppParams = Parameters<typeof db.app.deleteApp>[0]

export const useDeleteApp = () => {
  const [org] = useActivatedOrg()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (p: DeleteAppParams) => {
      return db.app.deleteApp(p)
    },
    onSuccess: () => {
      org.id && queryClient.invalidateQueries(listOrgAppQuery({ orgId: org.id }))
    }
  })
}
