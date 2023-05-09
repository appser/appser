import { atom, useAtom } from 'jotai'

import type { TApp } from 'web/types'

const activatedApp = atom<TApp | null | undefined>(null)

export const useActivatedApp = () => useAtom(activatedApp)
