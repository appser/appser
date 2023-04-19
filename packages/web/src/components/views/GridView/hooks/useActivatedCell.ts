import { atom, useAtom } from 'jotai'

import type { Cell } from '../cell/Cell'
import type { Column } from '../column/Column'
import type { Item, Rectangle } from '@glideapps/glide-data-grid'
import type { Row } from 'web/components/views/GridView/row/Row'

export interface ActivatedCell {
  row: Row
  cell: Cell
  column: Column
  bounds: Rectangle
  location: Item
}
const activatedCell = atom<ActivatedCell | null>(null)

export const useActivatedCell = () => useAtom(activatedCell)
