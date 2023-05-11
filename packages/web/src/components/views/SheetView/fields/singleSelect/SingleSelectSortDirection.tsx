import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortDirectionProps } from '..'
import type { FC } from 'react'

export const SingleSelectSortDirection: FC<FieldSortDirectionProps> = ({ onChange, defaultDirection }) => {
  return (
    <SegmentedControl
      onChange={v => onChange?.(v as FieldSortDirection)}
      defaultValue={defaultDirection}
      data={[
        { label: '选项顺序', value: 'asc' },
        { label: '选项倒序', value: 'desc' }
      ]}
    />
  )
}
