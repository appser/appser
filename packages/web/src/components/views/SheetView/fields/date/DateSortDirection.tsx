import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortDirectionProps } from '..'
import type { FC } from 'react'

export const DateSortDirection: FC<FieldSortDirectionProps> = ({ onChange, defaultDirection }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={defaultDirection}
      data={[
        { label: '过去到现在', value: 'asc' },
        { label: '现在到过去', value: 'desc' }
      ]}
    />
  )
}
