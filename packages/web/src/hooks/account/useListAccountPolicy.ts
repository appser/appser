import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const listAccountPolicyQuery = {
  queryKey: ['account', 'polices'],
  queryFn: async () => db.account.listAccountPolicy()
}

export const useListAccountPolicy = () => useQuery(listAccountPolicyQuery)
