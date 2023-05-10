import { Text } from '@appser/ui'
import { DatePickerInput } from '@mantine/dates'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const DateFormInput: FC<FieldFormInputProps> = ({ field, onChange, defaultData, denyEdit }) => {
  return (
    denyEdit
      ? <Text fz='sm'>{Number(defaultData)}</Text>
      : <DatePickerInput
          popoverProps={{ withinPortal: true }}
          placeholder="Pick date"
          variant='filled'
          onChange={v => v && onChange?.(v.toISOString())}
        />
  )
}
