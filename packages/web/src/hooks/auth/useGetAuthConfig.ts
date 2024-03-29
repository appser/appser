import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const getAuthConfigQuery = {
  queryKey: ['auth', 'config'],
  queryFn: () => db.auth.getAuthConfig(),
  staleTime: 5
}

export const useGetAuthConfig = () => useQuery(getAuthConfigQuery)
