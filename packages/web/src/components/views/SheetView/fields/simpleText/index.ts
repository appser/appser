import { GridCellKind } from '@glideapps/glide-data-grid'

import { simpleTextIcon } from './icon'
import { SimpleTextCellEditor } from './SimpleTextCellEditor'
import { SimpleTextFilterOperatorItem } from './SimpleTextFilterOperatorItem'
import { SimpleTextFormInput } from './SimpleTextFormInput'
import { SimpleTextSortDirection } from './SimpleTextSortDirection'

import type { FieldConfig } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'

export function useSimpleTextField(): FieldConfig<TextCell> {
  const toCellContent: FieldConfig<TextCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.Text,
      data: String(value),
      allowOverlay: false,
      displayData: String(value)
    }
  }

  return {
    CellEditor: SimpleTextCellEditor,
    FormInput: SimpleTextFormInput,
    FilterOperatorItem: SimpleTextFilterOperatorItem,
    SortDirection: SimpleTextSortDirection,
    toCellContent,
    icon: p => simpleTextIcon({ color: p.fgColor, size: 20 })
  }
}
