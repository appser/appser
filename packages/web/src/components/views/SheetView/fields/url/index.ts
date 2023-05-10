import { GridCellKind } from '@glideapps/glide-data-grid'

import { urlIcon } from './icon'
import { URLCellEditor } from './URLCellEditor'
import { URLFilterOperatorItem } from './URLFilterOperatorItem'
import { URLFormInput } from './URLFormInput'
import { URLSortDirection } from './URLSortDirection'

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
    FormInput: URLFormInput,
    CellEditor: URLCellEditor,
    FilterOperatorItem: URLFilterOperatorItem,
    SortDirection: URLSortDirection,
    toCellContent,
    icon: p => urlIcon({ color: p.fgColor, size: 20 })
  }
}
