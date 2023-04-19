import { atom, useAtom } from 'jotai'

import type { TView } from 'web/servers/dataset/types'

const activatedView = atom<TView | null>(null)

export const useActivatedView = () => useAtom(activatedView)
