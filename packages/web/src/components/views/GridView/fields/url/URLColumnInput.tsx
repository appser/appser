import { Text, TextInput } from '@appser/ui'

import type { FieldColumnInputProps } from '..'
import type { FC } from 'react'

export const URLColumnInput: FC<FieldColumnInputProps> = ({ column, onChange, data, denyEdit }) => {
  return (
    !denyEdit
      ? <TextInput
          w='100%'
          variant='filled'
          onChange={e => onChange?.(e.currentTarget.value)}
          value={String(data)}
        />
      : <Text fz='sm'>{String(data)}</Text>
  )
}
