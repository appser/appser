import { SegmentedControl } from '@mantine/core'

import type { FieldSortDirection, FieldSortProps } from '..'
import type { FC } from 'react'

export const NumIdSort: FC<FieldSortProps> = ({ onChange, direction }) => {
  return (
    <SegmentedControl
      onChange={v => onChange?.(v as FieldSortDirection)}
      defaultValue={direction}
      data={[
        { label: '由旧到新', value: 'asc' },
        { label: '由新到旧', value: 'desc' }
      ]}
    />
  )
}
