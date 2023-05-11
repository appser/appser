import type { Field } from '../field/Field'
import type { Row } from '../row/Row'
import type { GridCell, Item, Rectangle } from '@glideapps/glide-data-grid'

export interface Cell<T extends GridCell = GridCell> {
  row: Row
  gridCell: T
  field: Field
  bounds: Rectangle
  location: Item
}
