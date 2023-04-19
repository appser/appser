import { useQuery } from '@tanstack/react-query'

import { listOrgAppQuery } from './queries'

import type { ListOrgAppsParams } from './queries'

export const useListOrgApp = (query: ListOrgAppsParams) => {
  return useQuery(listOrgAppQuery(query))
}
