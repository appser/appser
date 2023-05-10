import { GridCellKind } from '@glideapps/glide-data-grid'

import { EmailCellEditor } from './EmailCellEditor'
import { EmailFilterOperatorItem } from './EmailFilterOperatorItem'
import { EmailFormInput } from './EmailFormInput'
import { EmailSortDirection } from './EmailSortDirection'
import { emailIcon } from './icon'

import type { FieldConfig } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'

export function useEmailFieldConfig(): FieldConfig<TextCell> {
  const toCellContent: FieldConfig<TextCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.Text,
      data: String(value),
      allowOverlay: false,
      displayData: String(value)
    }
  }

  return {
    FormInput: EmailFormInput,
    CellEditor: EmailCellEditor,
    FilterOperatorItem: EmailFilterOperatorItem,
    SortDirection: EmailSortDirection,
    toCellContent,
    icon: p => emailIcon({ color: p.fgColor, size: 20 })
  }
}
