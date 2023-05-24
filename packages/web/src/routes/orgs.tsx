import { Flex } from '@appser/ui'
import { useEffect } from 'react'
import { Outlet, redirect } from 'react-router-dom'
import { OrgSidebar } from 'web/components/org/OrgSidebar'
import { getLastOrgId, setLastOrgId } from 'web/helpers/lastOrgId'
import { loadQueryData } from 'web/helpers/loadQueryData'
import { listAccountOrgQuery, useListAccountOrg } from 'web/hooks/account/useListAccountOrg'
import { useActivateOrg } from 'web/hooks/ui/useActivateOrg'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url)
  const { orgId: currentOrgId } = params
  const orgs = await loadQueryData(queryClient, listAccountOrgQuery)
  const currentOrg = orgs.find((org) => org.id === currentOrgId)
  const lastOrgId = getLastOrgId()
  const lastOrg = orgs.find((org) => org.id === lastOrgId) || orgs[0]

  if (!lastOrg) throw redirect('/org/create')
  setLastOrgId(lastOrg.id)

  if (pathname === '/orgs') {
    throw redirect(`/orgs/${lastOrg.id}/apps`)
  }

  if (!currentOrg) throw redirect(`/404?from=${pathname}`)

  return { orgs, currentOrg }
}

export default function Org() {
  const [,setActivatedOrg] = useActivateOrg()
  const lastOrgId = getLastOrgId()
  const { data: orgs } = useListAccountOrg()

  useEffect(() => {
    if (orgs) {
      const currentOrg = orgs.find((org) => org.id === lastOrgId)
      currentOrg && setActivatedOrg(currentOrg)
    }
  }, [lastOrgId, orgs])

  return (
    <Flex h='100vh'>
      <OrgSidebar />
      <Outlet />
    </Flex>
  )
}
