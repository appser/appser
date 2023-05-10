import { Outlet } from 'react-router-dom'
import { getOrgQuery } from 'web/hooks/org/useGetOrg'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { orgId = '' } = params

  queryClient.prefetchQuery(getOrgQuery(orgId))

  return null
}

export default function OrgId() {
  return (
    <Outlet />
  )
}
