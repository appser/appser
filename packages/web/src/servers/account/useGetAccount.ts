import { useQuery } from '@tanstack/react-query'

import { getAccountQuery } from './queries'

export const useGetAccount = () => useQuery(getAccountQuery)
