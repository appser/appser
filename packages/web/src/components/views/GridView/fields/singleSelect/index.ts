import { GridCellKind } from '@glideapps/glide-data-grid'

import { SingleSelectCellEditor } from './SingleSelectCellEditor'
import { SingleSelectColumnInput } from './SingleSelectColumnInput'
import { SingleSelectFilter } from './SingleSelectFilter'
import { singleSelectIcon } from './singleSelectIcon'
import { SelectOptionEditor } from './SingleSelectOptionEditor'
import { SingleSelectSort } from './SingleSelectSort'

import type { FieldConfig } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'

export function useSingleSelectField(): FieldConfig<BubbleCell> {
  const toCellContent: FieldConfig<BubbleCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.Bubble,
      allowOverlay: false,
      data: Array.isArray(value) ? value : [value]
    }
  }

  return {
    OptionEditor: SelectOptionEditor,
    CellEditor: SingleSelectCellEditor,
    ColumnInput: SingleSelectColumnInput,
    Filter: SingleSelectFilter,
    Sort: SingleSelectSort,
    toCellContent,
    icon: p => singleSelectIcon({ color: p.fgColor, size: 20 })
  }
}
