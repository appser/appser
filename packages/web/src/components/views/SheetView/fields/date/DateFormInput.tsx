import { Text } from '@appser/ui'
import { DatePickerInput } from '@mantine/dates'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const DateFormInput: FC<FieldFormInputProps> = ({ field, onDone, defaultValue, denyEdit = true }) => {
  const date = typeof defaultValue === 'number' ? new Date(defaultValue) : undefined

  return (
    denyEdit
      ? <Text fz='sm'>{date ? date.toISOString() : ''}</Text>
      : <DatePickerInput
          w={200}
          popoverProps={{ withinPortal: true }}
          defaultValue={typeof defaultValue === 'number' ? new Date(defaultValue) : undefined}
          variant='filled'
          onChange={v => onDone?.(v?.valueOf() ?? v)}
        />
  )
}
