import { SegmentedControl } from '@mantine/core'

import type { FieldSortDirection, FieldSortProps } from '..'
import type { FC } from 'react'

export const MultipleSelectSort: FC<FieldSortProps> = ({ onChange, direction }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={direction}
      data={[
        { label: '选项顺序', value: 'asc' },
        { label: '选项倒序', value: 'desc' }
      ]}
    />
  )
}
