import { GridCellKind } from '@glideapps/glide-data-grid'

import { MultipleSelectCellEditor } from './MultipleSelectCellEditor'
import { MultipleSelectColumnInput } from './MultipleSelectColumnInput'
import { MultipleSelectFilter } from './MultipleSelectFilter'
import { multipleSelectIcon } from './multipleSelectIcon'
import { MultipleSelectOptionEditor } from './MultipleSelectOptionEditor'
import { MultipleSelectSort } from './MultipleSelectSort'

import type { FieldConfig } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'

export function useMultipleSelectField(): FieldConfig<BubbleCell> {
  const toCellContent: FieldConfig<BubbleCell>['toCellContent'] = ({ value }) => {
    if (!Array.isArray(value)) return

    return {
      kind: GridCellKind.Bubble,
      allowOverlay: false,
      data: value
    }
  }

  return {
    CellEditor: MultipleSelectCellEditor,
    OptionEditor: MultipleSelectOptionEditor,
    ColumnInput: MultipleSelectColumnInput,
    Filter: MultipleSelectFilter,
    Sort: MultipleSelectSort,
    toCellContent,
    icon: p => multipleSelectIcon({ color: p.fgColor, size: 20 })
  }
}
