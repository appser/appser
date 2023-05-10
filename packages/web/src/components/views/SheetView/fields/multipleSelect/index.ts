import { GridCellKind } from '@glideapps/glide-data-grid'

import { multipleSelectIcon } from './icon'
import { MultipleSelectCellEditor } from './MultipleSelectCellEditor'
import { MultipleSelectFilterOperatorItem } from './MultipleSelectFilterOperatorItem'
import { MultipleSelectFormInput } from './MultipleSelectFormInput'
import { MultipleSelectOptionEditor } from './MultipleSelectOptionEditor'
import { MultipleSelectSortDirection } from './MultipleSelectSortDirection'

import type { FieldConfig } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'

export function useMultipleSelectFieldConfig(): FieldConfig<BubbleCell> {
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
    FormInput: MultipleSelectFormInput,
    FilterOperatorItem: MultipleSelectFilterOperatorItem,
    SortDirection: MultipleSelectSortDirection,
    toCellContent,
    icon: p => multipleSelectIcon({ color: p.fgColor, size: 20 })
  }
}
