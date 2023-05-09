import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const listAccountOrgQuery = {
  queryKey: ['account', 'orgs'],
  queryFn: async () => db.account.listAccountOrg()
}

export type ListAccountOrgResponse = Awaited<ReturnType<typeof db.account.listAccountOrg>>

export const useListAccountOrg = () => useQuery(listAccountOrgQuery)
