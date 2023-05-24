import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActivateOrg } from 'web/hooks/ui/useActivateOrg'
import db from 'web/vendor/db'

import { listOrgAppQuery } from '../org/useListOrgApp'

export type DeleteAppParams = Parameters<typeof db.app.deleteApp>[0]

export const useDeleteApp = () => {
  const [org] = useActivateOrg()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (p: DeleteAppParams) => {
      return db.app.deleteApp(p)
    },
    onSuccess: () => {
      org.id && queryClient.invalidateQueries(listOrgAppQuery(org.id))
    }
  })
}
