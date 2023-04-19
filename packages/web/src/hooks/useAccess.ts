import Access from '@appser/access'
import { useMemo } from 'react'
import { useListAccountPolicy } from 'web/servers/account/useListAccountPolicy'

export default function useAccess() {
  const { data: policies } = useListAccountPolicy()
  const access = useMemo(() => new Access(policies), [policies])
  const can = access.can.bind(access)

  return { can, policies }
}
