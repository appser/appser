import { Outlet } from 'react-router-dom'
import { getAccountQuery, listAccountPolicyQuery } from 'web/servers/account/queries'
import { loadQueryData } from 'web/utils/loadQueryData'

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
