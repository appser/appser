import { NumberInput } from '@mantine/core'

import type { NumberInputProps } from '@mantine/core'
import type { FC } from 'react'

export const FormSectionNumberInput: FC<NumberInputProps> = (props) => {
  return (
    <NumberInput
      styles={{
        input: {
          paddingRight: 32
        }
      }}
      {...props}
    />
  )
}
