import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetcher } from 'react-router-dom'
import { listAccountOrgQuery } from 'web/hooks/account/useListAccountOrg'
import db from 'web/vendor/db'

import type { ListAccountOrgResponse } from 'web/hooks/account/useListAccountOrg'

export type DeleteOrgParams = Parameters<typeof db.org.deleteOrg>[0]

export const useDeleteOrg = () => {
  const queryClient = useQueryClient()
  const fetcher = useFetcher()

  return useMutation({
    mutationFn: async (p: DeleteOrgParams) => {
      return await db.org.deleteOrg(p)
    },
    onSuccess: (data, v) => {
      queryClient.setQueriesData<ListAccountOrgResponse>(listAccountOrgQuery, (orgs) => {
        return orgs?.filter(w => w.id !== v.orgId)
      })

      return fetcher.load('/orgs')
    }
  })
}
