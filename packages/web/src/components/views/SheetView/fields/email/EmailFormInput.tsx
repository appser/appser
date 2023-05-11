import { Text, TextInput } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const EmailFormInput: FC<FieldFormInputProps> = ({ field, onChange, defaultData, denyEdit }) => {
  return (
    denyEdit
      ? <Text fz='sm'>{String(defaultData)}</Text>
      : <TextInput
          variant='filled'
          defaultValue={String(defaultData ?? '')}
          onChange={e => onChange?.(e.currentTarget.value)}
        />
  )
}
