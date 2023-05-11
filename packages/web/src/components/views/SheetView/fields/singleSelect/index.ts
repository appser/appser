import { GridCellKind } from '@glideapps/glide-data-grid'

import { singleSelectIcon } from './icon'
import { SingleSelectCellEditor } from './SingleSelectCellEditor'
import { SingleSelectFilterOperatorItem } from './SingleSelectFilterOperatorItem'
import { SingleSelectFormInput } from './SingleSelectFormInput'
import { SelectOptionEditor } from './SingleSelectOptionEditor'
import { SingleSelectSortDirection } from './SingleSelectSortDirection'

import type { FieldConfig } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'

export function useSingleSelectField(): FieldConfig<BubbleCell> {
  const toCellContent: FieldConfig<BubbleCell>['toCellContent'] = ({ value, field }) => {
    if (field.type !== 'singleSelect') return

    const data = [value].flat().map(v => field.options.items.find(i => i.id === v)?.name).filter(v => v) as string[]

    return {
      kind: GridCellKind.Bubble,
      allowOverlay: false,
      data
    }
  }

  return {
    OptionEditor: SelectOptionEditor,
    CellEditor: SingleSelectCellEditor,
    FormInput: SingleSelectFormInput,
    FilterOperatorItem: SingleSelectFilterOperatorItem,
    SortDirection: SingleSelectSortDirection,
    toCellContent,
    icon: p => singleSelectIcon({ color: p.fgColor, size: 20 })
  }
}
