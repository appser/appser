import { atom, useAtom } from 'jotai'

import type { App } from 'web/types'

const activatedApp = atom<App | null | undefined>(null)

export const useActivatedApp = () => useAtom(activatedApp)
