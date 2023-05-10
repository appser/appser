import { Checkbox } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const CheckboxFormInput: FC<FieldFormInputProps> = ({ field, onChange, defaultData, denyEdit }) => {
  return (
    <Checkbox
      onChange={e => onChange?.(e.currentTarget.checked)}
      disabled={denyEdit}
    />
  )
}
