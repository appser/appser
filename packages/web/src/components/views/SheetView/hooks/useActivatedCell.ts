import { atom, useAtom } from 'jotai'

import type { Cell } from '../cell/Cell'
import type { SheetField } from '../field/Field'
import type { Item, Rectangle } from '@glideapps/glide-data-grid'
import type { Row } from 'web/components/views/SheetView/row/Row'

export interface ActivatedCell {
  row: Row
  cell: Cell
  field: SheetField
  bounds: Rectangle
  location: Item
}
const activatedCell = atom<ActivatedCell | null>(null)

export const useActivatedCell = () => useAtom(activatedCell)
