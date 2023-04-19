import { GridCellKind } from '@glideapps/glide-data-grid'

import { NumberCellEditor } from './NumberCellEditor'
import { NumberColumnInput } from './NumberColumnInput'
import { NumberFilter } from './NumberFilter'
import { numberIcon } from './numberIcon'
import { NumberOptionEditor } from './NumberOptionEditor'
import { NumberSort } from './NumberSort'

import type { FieldConfig } from '..'
import type { NumberCell } from '@glideapps/glide-data-grid'

export function useNumberField(): FieldConfig<NumberCell> {
  const toCellContent: FieldConfig<NumberCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.Number,
      data: Number(value),
      allowOverlay: false,
      displayData: String(value)
    }
  }

  return {
    ColumnInput: NumberColumnInput,
    OptionEditor: NumberOptionEditor,
    CellEditor: NumberCellEditor,
    Filter: NumberFilter,
    Sort: NumberSort,
    toCellContent,
    icon: p => numberIcon({ color: p.fgColor, size: 20 })
  }
}
