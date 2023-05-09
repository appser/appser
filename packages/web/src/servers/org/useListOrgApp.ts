import { useQuery } from '@tanstack/react-query'

import { listOrgAppQuery } from './queries'

import type { ListOrgAppsParams } from './queries'
import type db from 'web/vendor/db'

export type ListOrgAppResponse = Awaited<ReturnType<typeof db.org.listOrgApp>>

export const useListOrgApp = (query: ListOrgAppsParams) => {
  return useQuery(listOrgAppQuery(query))
}
