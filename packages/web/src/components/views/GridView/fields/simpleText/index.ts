import { GridCellKind } from '@glideapps/glide-data-grid'

import { SimpleTextCellEditor } from './SimpleTextCellEditor'
import { SimpleTextColumnInput } from './SimpleTextColumnInput'
import { SimpleTextFilter } from './SimpleTextFilter'
import { simpleTextIcon } from './simpleTextIcon'
import { SimpleTextSort } from './SimpleTextSort'

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
    ColumnInput: SimpleTextColumnInput,
    Filter: SimpleTextFilter,
    Sort: SimpleTextSort,
    toCellContent,
    icon: p => simpleTextIcon({ color: p.fgColor, size: 20 })
  }
}
