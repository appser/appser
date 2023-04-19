import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { listOrgPeopleQuery } from './queries'

export type ChangeOrgPeopleRoleParams = Parameters<typeof db.org.changeOrgPeopleRole>[0]

export const useChangeOrgPeopleRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (p: ChangeOrgPeopleRoleParams) => {
      return await db.org.changeOrgPeopleRole(p)
    },
    onSuccess: (data, { orgId, userId }) => {
      queryClient.invalidateQueries(listOrgPeopleQuery({ orgId, kind: 'member' }))
    }
  })
}
