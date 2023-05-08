import { GridCellKind } from '@glideapps/glide-data-grid'
import useAccess from 'web/hooks/useAccess'
import { useActivatedApp } from 'web/hooks/useActivatedApp'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'

import { CheckboxColumnInput } from './CheckboxColumnInput'
import { CheckboxFilter } from './CheckboxFilter'
import { checkBoxIcon } from './checkBoxIcon'
import { CheckboxSort } from './CheckboxSort'

import type { FieldConfig } from '..'
import type { BooleanCell } from '@glideapps/glide-data-grid'

export function useCheckboxField(): FieldConfig<BooleanCell> {
  const { can } = useAccess()
  const [app] = useActivatedApp()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()

  const toCellContent: FieldConfig<BooleanCell>['toCellContent'] = ({ row, column, value }) => {
    const { deny } = can('app:dataset:view:record:column:update', {
      appId: app?.id ?? '',
      datasetId: dataset?.id ?? '',
      viewId: view?.id ?? '',
      recordId: row?.record.id ?? '',
      fieldName: column.name
    })

    return {
      kind: GridCellKind.Boolean,
      data: Boolean(value),
      readonly: deny,
      allowOverlay: false
    }
  }

  return {
    ColumnInput: CheckboxColumnInput,
    Filter: CheckboxFilter,
    Sort: CheckboxSort,
    toCellContent,
    icon: p => checkBoxIcon({ color: p.fgColor, size: 20 })
  }
}
