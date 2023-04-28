import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortProps } from '..'
import type { FC } from 'react'

export const DateSort: FC<FieldSortProps> = ({ onChange, direction }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={direction}
      data={[
        { label: '过去到现在', value: 'asc' },
        { label: '现在到过去', value: 'desc' }
      ]}
    />
  )
}
