import { atom, useAtom } from 'jotai'

import type { Dataset } from 'web/types'

const activatedDataset = atom<Dataset | null | undefined>(null)

export const useActivatedDataset = () => useAtom(activatedDataset)
