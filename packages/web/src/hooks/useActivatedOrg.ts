import { atom, useAtom } from 'jotai'
import { setLastOrgId } from 'web/servers/org/utils'

import type { Optional } from '@appser/common'
import type { TOrg } from 'web/servers/org/types'

const activatedOrg = atom<Optional<TOrg, 'id'>, TOrg>({
  image: '',
  name: ''
}, (get, set, org) => {
  set(activatedOrg, org)
  setLastOrgId(org.id)
})

export const useActivatedOrg = () => useAtom(activatedOrg)
