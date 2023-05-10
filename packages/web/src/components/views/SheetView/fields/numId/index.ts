import { GridCellKind } from '@glideapps/glide-data-grid'

import { numIdIcon } from './icon'
import { NumIdFilterOperatorItem } from './NumIdFilterOperatorItem'
import { NumIdSortDirection } from './NumIdSort'

import type { FieldConfig } from '..'
import type { RowIDCell } from '@glideapps/glide-data-grid'

export function useNumIdField(): FieldConfig<RowIDCell> {
  const toCellContent: FieldConfig<RowIDCell>['toCellContent'] = ({ value }) => {
    return {
      kind: GridCellKind.RowID,
      data: String(value),
      readonly: true,
      allowOverlay: false
    }
  }

  return {
    toCellContent,
    FilterOperatorItem: NumIdFilterOperatorItem,
    SortDirection: NumIdSortDirection,
    icon: p => numIdIcon({ color: p.fgColor, size: 20 })
  }
}
