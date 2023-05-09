import { NumberInput } from '@appser/ui'

import type { NumberInputProps } from '@appser/ui'
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
