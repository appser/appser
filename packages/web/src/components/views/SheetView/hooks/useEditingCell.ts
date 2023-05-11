import { atom, useAtom } from 'jotai'

import type { Cell } from '../cell/Cell'

const editingCell = atom<Cell | null>(null)

export const useEditingCell = () => useAtom(editingCell)
