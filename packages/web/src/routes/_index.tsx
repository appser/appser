import { Outlet } from 'react-router-dom'
import { loadQueryData } from 'web/helpers/loadQueryData'
import { getAccountQuery } from 'web/hooks/account/useGetAccount'
import { listAccountPolicyQuery } from 'web/hooks/account/useListAccountPolicy'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunction } from 'react-router-dom'

export const loader = (queryClient: QueryClient): LoaderFunction => async ({ request, params }) => {
  const [currentUser, userPolicies] = await Promise.all([
    loadQueryData(queryClient, getAccountQuery),
    loadQueryData(queryClient, listAccountPolicyQuery)
  ])

  return { currentUser, userPolicies }
}

export default function Index() {
  return (
    <Outlet />
  )
}
