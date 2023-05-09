import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetcher } from 'react-router-dom'
import db from 'web/vendor/db'

import { listAccountOrgQuery } from './useListAccountOrg'
import { setLastOrgId } from '../org/utils'

import type { ListAccountOrgResponse } from './useListAccountOrg'

export const useCreateOrg = () => {
  const queryClient = useQueryClient()
  const fetcher = useFetcher()

  return useMutation({
    mutationFn: async (name: string) => {
      return db.account.createOrg({
        requestBody: {
          name
        }
      })
    },
    onSuccess: (data, v) => {
      queryClient.setQueriesData<ListAccountOrgResponse>(listAccountOrgQuery, (orgs) => {
        return orgs?.concat({ ...data, status: 'active' })
      })
      setLastOrgId(data.id)

      return fetcher.load('/orgs')
    }
  })
}
