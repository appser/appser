import { singleSelectIcon } from './icon'
import { SingleSelectCellEditor } from './SingleSelectCellEditor'
import { SingleSelectFilterOperatorItem } from './SingleSelectFilterOperatorItem'
import { SingleSelectFormInput } from './SingleSelectFormInput'
import { SelectOptionEditor } from './SingleSelectOptionEditor'
import { SingleSelectSort } from './SingleSelectSort'
import { toCellContent } from './toCellContent'

import type { FieldConfig } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'

export function useSingleSelectField(): FieldConfig<BubbleCell> {
  return {
    OptionEditor: SelectOptionEditor,
    CellEditor: SingleSelectCellEditor,
    FormInput: SingleSelectFormInput,
    FilterOperatorItem: SingleSelectFilterOperatorItem,
    SortDirection: SingleSelectSort,
    toCellContent,
    icon: p => singleSelectIcon({ color: p.fgColor, size: 20 })
  }
}
