import { NumberInput, Text } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const NumberFormInput: FC<FieldFormInputProps> = ({ field: column, onChange, defaultData: data, denyEdit }) => {
  return (
    !denyEdit
      ? <NumberInput
          variant='filled'
          value={isNaN(Number(data)) ? undefined : Number(data)}
          onChange={onChange}
        />
      : <Text fz='sm'>{isNaN(Number(data)) ? undefined : Number(data)}</Text>
  )
}
