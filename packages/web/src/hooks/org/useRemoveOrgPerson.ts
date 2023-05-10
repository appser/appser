import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { listOrgPeopleQuery } from './useListOrgPeople'

type ListOrgPeopleResponse = Awaited<ReturnType<typeof db.org.listOrgPeople>>

type RemoveOrgPeopleParams = Parameters<typeof db.org.removeOrgPeople>[0]

export const useRemoveOrgPerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (p: RemoveOrgPeopleParams) => {
      return await db.org.removeOrgPeople(p)
    },
    onSuccess: (data, { orgId, userId }) => {
      queryClient.setQueriesData<ListOrgPeopleResponse>(listOrgPeopleQuery({ orgId, kind: 'member' }), (people) => {
        return people?.filter(p => p.user.id !== userId)
      })
    }
  })
}
