import { NumberInput, Text } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const NumberFormInput: FC<FieldFormInputProps> = ({ field, onChange, defaultValue: data, denyEdit }) => {
  return (
    denyEdit
      ? <Text fz='sm'>{isNaN(Number(data)) ? undefined : Number(data)}</Text>
      : <NumberInput
          variant='filled'
          defaultValue={isNaN(Number(data)) ? undefined : Number(data)}
          onChange={onChange}
        />
  )
}
