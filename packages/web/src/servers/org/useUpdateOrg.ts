import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { listAccountOrgQuery } from 'web/servers/account/queries'
import db from 'web/vendor/db'

import { getOrgQuery } from './queries'

import type { TOrg } from './types'
import type { ListAccountOrgResponse } from 'web/servers/account/useListAccountOrg'

type UpdateOrgParams = Parameters<typeof db.org.updateOrg>[0]

export const useUpdateOrg = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (p: UpdateOrgParams) => {
      return db.org.updateOrg(p)
    },
    onSuccess: (data, { orgId, requestBody: { name } }) => {
      queryClient.setQueriesData<TOrg>(getOrgQuery({ orgId }), (org) => {
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
