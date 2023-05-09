import { Checkbox } from '@appser/ui'

import type { FieldColumnInputProps } from '..'
import type { FC } from 'react'

export const CheckboxColumnInput: FC<FieldColumnInputProps> = ({ column, onChange, data }) => {
  return (
    <Checkbox onChange={e => onChange?.(e.currentTarget.checked)} />
  )
}
