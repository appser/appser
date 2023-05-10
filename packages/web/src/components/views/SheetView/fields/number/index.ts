import { GridCellKind } from '@glideapps/glide-data-grid'

import { numberIcon } from './icon'
import { NumberCellEditor } from './NumberCellEditor'
import { NumberFilterOperatorItem } from './NumberFilterOperatorItem'
import { NumberFormInput } from './NumberFormInput'
import { NumberOptionEditor } from './NumberOptionEditor'
import { NumberSortDirection } from './NumberSortDirection'

import type { FieldConfig } from '..'
import type { NumberCell } from '@glideapps/glide-data-grid'

export function useNumberFieldConfig(): FieldConfig<NumberCell> {
  const toCellContent: FieldConfig<NumberCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.Number,
      data: Number(value),
      allowOverlay: false,
      displayData: String(value)
    }
  }

  return {
    FormInput: NumberFormInput,
    OptionEditor: NumberOptionEditor,
    CellEditor: NumberCellEditor,
    FilterOperatorItem: NumberFilterOperatorItem,
    SortDirection: NumberSortDirection,
    toCellContent,
    icon: p => numberIcon({ color: p.fgColor, size: 20 })
  }
}
