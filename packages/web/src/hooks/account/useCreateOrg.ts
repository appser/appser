import { PersonStatus } from '@appser/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetcher } from 'react-router-dom'
import { setLastOrgId } from 'web/helpers/lastOrgId'
import db from 'web/vendor/db'

import { listAccountOrgQuery } from './useListAccountOrg'

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
        return orgs?.concat({ ...data, status: PersonStatus.ACTIVE })
      })
      setLastOrgId(data.id)

      return fetcher.load('/orgs')
    }
  })
}
