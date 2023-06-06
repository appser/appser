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
  return {
    CellEditor: MultipleSelectCellEditor,
    OptionEditor: MultipleSelectOptionEditor,
    FormInput: MultipleSelectFormInput,
    FilterOperatorItem: MultipleSelectFilterOperatorItem,
    SortDirection: MultipleSelectSortDirection,
    toCellContent({ value, field }) {
      if (!Array.isArray(value) || field.type !== 'multipleSelect') return

      const data = value
        .map(v => field.options.items.find(item => item.id === v)?.name)
        .filter(Boolean) as string[]

      return {
        kind: GridCellKind.Bubble,
        allowOverlay: false,
        data
      }
    },
    icon: p => multipleSelectIcon({ color: p.fgColor, size: 20 })
  }
}
