import { SegmentedControl } from '@mantine/core'

import type { FieldSortDirection, FieldSortProps } from '..'
import type { FC } from 'react'

export const URLSort: FC<FieldSortProps> = ({ onChange, direction }) => {
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
