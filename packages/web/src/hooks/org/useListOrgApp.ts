import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

type P = Parameters<typeof db.org.listOrgApp>[0]

export const listOrgAppQuery = (orgId: string) => ({
  queryKey: ['org', orgId, 'apps'],
  queryFn: async () => db.org.listOrgApp({ orgId })
})

export type ListOrgAppResponse = Awaited<ReturnType<typeof db.org.listOrgApp>>

export const useListOrgApp = (query: P) => {
  return useQuery(listOrgAppQuery(query.orgId))
}
