import { atom, useAtom } from 'jotai'

import type { TDataset } from 'web/servers/dataset/types'

const activatedDataset = atom<TDataset | null | undefined>(null)

export const useActivatedDataset = () => useAtom(activatedDataset)
