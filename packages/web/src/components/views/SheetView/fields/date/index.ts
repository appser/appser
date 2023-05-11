import { GridCellKind } from '@glideapps/glide-data-grid'

import { DateCellEditor } from './DateCellEditor'
import { DateFilterOperatorItem } from './DateFilterOperatorItem'
import { DateFormInput } from './DateFormInput'
import { DateOptionEditor } from './DateOptionEditor'
import { DateSortDirection } from './DateSortDirection'
import { dateIcon } from './icon'

import type { FieldConfig } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'

export function useDateFieldConfig(): FieldConfig<TextCell> {
  const toCellContent: FieldConfig<TextCell>['toCellContent'] = ({ field, value }) => {
    if (field.type !== 'date') return

    const { calendar = 'gregory', dateStyle = 'short', timeStyle = 'short' } = field.options ?? {}
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
    FormInput: DateFormInput,
    OptionEditor: DateOptionEditor,
    CellEditor: DateCellEditor,
    FilterOperatorItem: DateFilterOperatorItem,
    SortDirection: DateSortDirection,
    toCellContent,
    icon: p => dateIcon({ color: p.fgColor, size: 20 })
  }
}