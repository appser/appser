import { SegmentedControl } from '@mantine/core'

import type { FieldSortDirection, FieldSortProps } from '..'
import type { FC } from 'react'

export const NumberSort: FC<FieldSortProps> = ({ onChange, direction }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={direction}
      data={[
        { label: '由小到大', value: 'asc' },
        { label: '由大到小', value: 'desc' }
      ]}
    />
  )
}
