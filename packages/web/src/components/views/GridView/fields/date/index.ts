import { GridCellKind } from '@glideapps/glide-data-grid'

import { DateCellEditor } from './DateCellEditor'
import { DateColumnInput } from './DateColumnInput'
import { DateFilter } from './DateFilter'
import { dateIcon } from './dateIcon'
import { DateOptionEditor } from './DateOptionEditor'
import { DateSort } from './DateSort'

import type { FieldConfig } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'

export function useDateField(): FieldConfig<TextCell> {
  const toCellContent: FieldConfig<TextCell>['toCellContent'] = ({ column, value }) => {
    if (column.field !== 'date') return

    const { calendar = 'gregory', dateStyle = 'short', timeStyle = 'short' } = column.options ?? {}
    const displayData = new Intl.DateTimeFormat(`${navigator.language}-u-ca-${calendar}`, {
      dateStyle,
      timeStyle
    }).format(Number(value))

    return {
      kind: GridCellKind.Text,
      data: String(value),
      allowOverlay: false,
      displayData
    }
  }

  return {
    ColumnInput: DateColumnInput,
    OptionEditor: DateOptionEditor,
    CellEditor: DateCellEditor,
    Filter: DateFilter,
    Sort: DateSort,
    toCellContent,
    icon: p => dateIcon({ color: p.fgColor, size: 20 })
  }
}
