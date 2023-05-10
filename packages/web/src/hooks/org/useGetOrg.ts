import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const getOrgQuery = (orgId: string) => ({
  queryKey: ['org', orgId],
  queryFn: async () => db.org.getOrg({ orgId })
})

export const useGetOrg = (orgId: string) => useQuery(getOrgQuery(orgId))
