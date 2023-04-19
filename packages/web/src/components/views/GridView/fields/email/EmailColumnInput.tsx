import { Text, TextInput } from '@mantine/core'

import type { FieldColumnInputProps } from '..'
import type { FC } from 'react'

export const EmailColumnInput: FC<FieldColumnInputProps> = ({ column, onChange, data, denyEdit }) => {
  return (
    !denyEdit ? <TextInput variant='filled' onChange={e => onChange?.(e.currentTarget.value)} /> : <Text fz='sm'>{String(data)}</Text>
  )
}
