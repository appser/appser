import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const getAccountQuery = {
  queryKey: ['account'],
  queryFn: async () => db.account.getAccount()
}

export const useGetAccount = () => useQuery(getAccountQuery)
