import { Select } from '@mantine/core'
import { IconSelector } from 'web/components/icons/IconSelector'

import type { SelectProps } from '@mantine/core'
import type { FC } from 'react'

export const FormSectionSelect: FC<SelectProps> = (props) => {
  return (
    <Select
      withinPortal
      rightSection={<IconSelector size={16} />}
      rightSectionWidth={22}
      styles={{
        input: {
          paddingRight: 17
        },
        item: {
          padding: '5px 10px'
        }
      }}
      {...props}
    />
  )
}
