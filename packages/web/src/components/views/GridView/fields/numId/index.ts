import { GridCellKind } from '@glideapps/glide-data-grid'

import { NumIdFilter } from './NumIdFilter'
import { numIdIcon } from './numIdIcon'
import { NumIdSort } from './NumIdSort'

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
    Filter: NumIdFilter,
    Sort: NumIdSort,
    icon: p => numIdIcon({ color: p.fgColor, size: 20 })
  }
}
