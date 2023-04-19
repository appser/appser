import { useQuery } from '@tanstack/react-query'

import { getOrgQuery } from './queries'

export const useGetOrg = (orgId: string) => useQuery(getOrgQuery({ orgId }))
