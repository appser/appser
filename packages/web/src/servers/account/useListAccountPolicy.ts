import { useQuery } from '@tanstack/react-query'

import { listAccountPolicyQuery } from './queries'

export const useListAccountPolicy = () => useQuery(listAccountPolicyQuery)
