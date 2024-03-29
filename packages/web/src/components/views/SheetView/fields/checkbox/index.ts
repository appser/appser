import { GridCellKind } from '@glideapps/glide-data-grid'
import useAccess from 'web/hooks/ui/useAccess'
import { useActivateApp } from 'web/hooks/ui/useActivateApp'
import { useActivateDataset } from 'web/hooks/ui/useActivateDataset'
import { useActivateView } from 'web/hooks/ui/useActivateView'

import { CheckboxFilterOperatorItem } from './CheckboxFilterOperatorItem'
import { CheckboxFormInput } from './CheckboxFormInput'
import { CheckboxSortDirection } from './CheckboxSortDirection'
import { checkBoxIcon } from './icon'

import type { FieldConfig } from '..'
import type { BooleanCell } from '@glideapps/glide-data-grid'

export function useCheckboxFieldConfig(): FieldConfig<BooleanCell> {
  const { can } = useAccess()
  const [app] = useActivateApp()
  const [dataset] = useActivateDataset()
  const [view] = useActivateView()

  const toCellContent: FieldConfig<BooleanCell>['toCellContent'] = ({ row, field, value }) => {
    const { deny } = can('app:dataset:record:field:update', {
      appId: app?.id ?? '',
      datasetId: dataset?.id ?? '',
      recordId: row?.record.id ?? '',
      fieldName: field.name
    })

    return {
      kind: GridCellKind.Boolean,
      data: Boolean(value),
      readonly: deny,
      allowOverlay: false
    }
  }

  return {
    FormInput: CheckboxFormInput,
    FilterOperatorItem: CheckboxFilterOperatorItem,
    SortDirection: CheckboxSortDirection,
    toCellContent,
    icon: p => checkBoxIcon({ color: p.fgColor, size: 20 })
  }
}
