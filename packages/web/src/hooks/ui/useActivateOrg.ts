import { atom, useAtom } from 'jotai'
import { getLastOrgId, setLastOrgId } from 'web/helpers/lastOrgId'

import type { Org } from 'web/types'

const activatedOrgAtom = atom(
  {
    id: getLastOrgId(),
    image: '',
    name: ''
  },
  (_get, set, org: Org) => {
    set(activatedOrgAtom, org)
    setLastOrgId(org.id)
  }
)

export const useActivateOrg = () => useAtom(activatedOrgAtom)
