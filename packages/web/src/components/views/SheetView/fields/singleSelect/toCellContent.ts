import { GridCellKind } from '@glideapps/glide-data-grid'

import type { FieldConfig } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'

export const toCellContent: FieldConfig<BubbleCell>['toCellContent'] = ({ value, field }) => {
  if (field.type !== 'singleSelect') return
  const data = [value].flat().map(v => field.options.items.find(i => i.id === v)?.name).filter(v => v) as string[]

  return {
    kind: GridCellKind.Bubble,
    allowOverlay: false,
    data
  }
}
