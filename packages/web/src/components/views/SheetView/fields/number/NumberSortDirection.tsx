import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortDirectionProps } from '..'
import type { FC } from 'react'

export const NumberSortDirection: FC<FieldSortDirectionProps> = ({ onChange, defaultDirection }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={defaultDirection}
      data={[
        { label: '由小到大', value: 'asc' },
        { label: '由大到小', value: 'desc' }
      ]}
    />
  )
}
