import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortProps } from '..'
import type { FC } from 'react'

export const CheckboxSort: FC<FieldSortProps> = ({ onChange, direction }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={direction}
      data={[
        { label: 'Asc', value: 'asc' },
        { label: 'Desc', value: 'desc' }
      ]}
    />
  )
}
