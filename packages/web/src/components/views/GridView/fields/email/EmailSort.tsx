import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortProps } from '..'
import type { FC } from 'react'

export const EmailSort: FC<FieldSortProps> = ({ onChange, direction }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={direction}
      data={[
        { label: 'A-Z', value: 'asc' },
        { label: 'Z-A', value: 'desc' }
      ]}
    />
  )
}
