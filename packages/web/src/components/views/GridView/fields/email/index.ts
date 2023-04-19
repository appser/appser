import { GridCellKind } from '@glideapps/glide-data-grid'

import { EmailCellEditor } from './EmailCellEditor'
import { EmailColumnInput } from './EmailColumnInput'
import { EmailFilter } from './EmailFilter'
import { emailIcon } from './emailIcon'
import { EmailSort } from './EmailSort'

import type { FieldConfig } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'

export function useEmailField(): FieldConfig<TextCell> {
  const toCellContent: FieldConfig<TextCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.Text,
      data: String(value),
      allowOverlay: false,
      displayData: String(value)
    }
  }

  return {
    ColumnInput: EmailColumnInput,
    CellEditor: EmailCellEditor,
    Filter: EmailFilter,
    Sort: EmailSort,
    toCellContent,
    icon: p => emailIcon({ color: p.fgColor, size: 20 })
  }
}
