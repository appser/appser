import { Text, TextInput } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const SimpleTextFormInput: FC<FieldFormInputProps> = ({ field, defaultValue: defaultData = '', onChange, denyEdit }) => {
  return (
    denyEdit
      ? <Text fz='sm'>{String(defaultData)}</Text>
      : <TextInput
          variant='filled'
          w='100%'
          defaultValue={String(defaultData)}
          onChange={e => onChange?.(e.currentTarget.value)}
        />
  )
}
