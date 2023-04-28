import { Text, TextInput } from '@appser/ui'

import type { FieldColumnInputProps } from '..'
import type { FC } from 'react'

export const SimpleTextColumnInput: FC<FieldColumnInputProps> = ({ column, data, onChange, denyEdit }) => {
  return (
    !denyEdit
      ? <TextInput
          variant='filled'
          w='100%'
          value={String(data)}
          onChange={e => onChange?.(e.currentTarget.value)}
        />
      : <Text fz='sm'>{String(data)}</Text>
  )
}
