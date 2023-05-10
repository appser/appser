import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { listAccountOrgQuery } from 'web/hooks/account/useListAccountOrg'
import db from 'web/vendor/db'

import { getOrgQuery } from './useGetOrg'

import type { ListAccountOrgResponse } from 'web/hooks/account/useListAccountOrg'
import type { Org } from 'web/types'

type UpdateOrgParams = Parameters<typeof db.org.updateOrg>[0]

export const useUpdateOrg = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (p: UpdateOrgParams) => {
      return db.org.updateOrg(p)
    },
    onSuccess: (data, { orgId, requestBody: { name } }) => {
      queryClient.setQueriesData<Org>(getOrgQuery(orgId), (org) => {
        if (!org) return

        org.name = name

        return org
      })
      queryClient.setQueriesData<ListAccountOrgResponse>(listAccountOrgQuery, (orgs) => {
        if (!orgs) return

        return cloneDeep(orgs).map(org => {
          if (org.id === orgId) {
            org.name = name
          }

          return org
        })
      })
    }
  })
}
