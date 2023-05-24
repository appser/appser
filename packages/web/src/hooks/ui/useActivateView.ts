import { atom, useAtom } from 'jotai'

import type { View } from 'web/types'

const activatedView = atom<View | null>(null)

export const useActivateView = () => useAtom(activatedView)
