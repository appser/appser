import { Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'

import type { FieldColumnInputProps } from '..'
import type { FC } from 'react'

export const DateColumnInput: FC<FieldColumnInputProps> = ({ column, onChange, data, denyEdit }) => {
  return (
    !denyEdit
      ? <DatePickerInput
          popoverProps={{ withinPortal: true }}
          placeholder="Pick date"
          variant='filled'
          onChange={v => v && onChange?.(v.toISOString())}
        />
      : <Text fz='sm'>{Number(data)}</Text>
  )
}
