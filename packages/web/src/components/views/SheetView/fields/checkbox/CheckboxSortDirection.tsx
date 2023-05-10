import { SegmentedControl } from '@appser/ui'

import type { FieldSortDirection, FieldSortDirectionProps } from '..'
import type { FC } from 'react'

export const CheckboxSortDirection: FC<FieldSortDirectionProps> = ({ onChange, defaultDirection }) => {
  return (
    <SegmentedControl
      onChange={(v) => onChange?.(v as FieldSortDirection)}
      defaultValue={defaultDirection}
      data={[
        { label: 'Asc', value: 'asc' },
        { label: 'Desc', value: 'desc' }
      ]}
    />
  )
}
