import { Text, TextInput } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const URLFormInput: FC<FieldFormInputProps> = ({ field, onChange, defaultValue: defaultData = '', denyEdit }) => {
  return (
    denyEdit
      ? <Text fz='sm'>{String(defaultData)}</Text>
      : <TextInput
          w='100%'
          variant='filled'
          onChange={e => onChange?.(e.currentTarget.value)}
          defaultValue={String(defaultData)}
        />
  )
}
