import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortDirectionProps } from '..'
import type { FC } from 'react'

export const NumIdSortDirection: FC<FieldSortDirectionProps> = ({ onChange, defaultDirection }) => {
  return (
    <SegmentedControl
      onChange={v => onChange?.(v as FieldSortDirection)}
      defaultValue={defaultDirection}
      data={[
        { label: '由旧到新', value: 'asc' },
        { label: '由新到旧', value: 'desc' }
      ]}
    />
  )
}
