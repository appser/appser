import { GridCellKind } from '@glideapps/glide-data-grid'

import { URLCellEditor } from './URLCellEditor'
import { URLColumnInput } from './URLColumnInput'
import { URLFilter } from './URLFilter'
import { urlIcon } from './urlIcon'
import { URLSort } from './URLSort'

import type { FieldConfig } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'

export function useURLField(): FieldConfig<TextCell> {
  const toCellContent: FieldConfig<TextCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.Text,
      data: String(value),
      allowOverlay: false,
      displayData: String(value)
    }
  }

  return {
    ColumnInput: URLColumnInput,
    CellEditor: URLCellEditor,
    Filter: URLFilter,
    Sort: URLSort,
    toCellContent,
    icon: p => urlIcon({ color: p.fgColor, size: 20 })
  }
}
