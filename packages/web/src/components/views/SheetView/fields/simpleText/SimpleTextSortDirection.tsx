import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortDirectionProps } from '..'
import type { FC } from 'react'

export const SimpleTextSortDirection: FC<FieldSortDirectionProps> = ({ onChange, defaultDirection }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={defaultDirection}
      data={[
        { label: 'A-Z', value: 'asc' },
        { label: 'Z-A', value: 'desc' }
      ]}
    />
  )
}
