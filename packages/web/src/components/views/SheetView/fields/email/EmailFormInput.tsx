import { Text, TextInput } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const EmailFormInput: FC<FieldFormInputProps> = ({ field, onDone, defaultValue, denyEdit }) => {
  return (
    denyEdit
      ? <Text fz='sm'>{String(defaultValue)}</Text>
      : <TextInput
          variant='filled'
          defaultValue={String(defaultValue ?? '')}
          onChange={e => onDone?.(e.currentTarget.value)}
        />
  )
}
