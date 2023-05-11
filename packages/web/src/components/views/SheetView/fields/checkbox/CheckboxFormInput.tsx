import { Checkbox } from '@appser/ui'

import type { FieldFormInputProps } from '..'
import type { FC } from 'react'

export const CheckboxFormInput: FC<FieldFormInputProps> = ({ field, onDone, defaultValue: defaultData, denyEdit = false }) => {
  return (
    <Checkbox
      defaultChecked={Boolean(defaultData)}
      onChange={e => onDone?.(e.currentTarget.checked)}
      disabled={denyEdit}
    />
  )
}
