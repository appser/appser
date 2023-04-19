import { NumberInput, Text } from '@mantine/core'

import type { FieldColumnInputProps } from '..'
import type { FC } from 'react'

export const NumberColumnInput: FC<FieldColumnInputProps> = ({ column, onChange, data, denyEdit }) => {
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
