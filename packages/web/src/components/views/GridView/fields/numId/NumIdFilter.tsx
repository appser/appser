import { Group, NumberInput, Select, TextInput, useForm } from '@appser/ui'
import { useEffect } from 'react'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const NumIdFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
  const form = useForm({
    initialValues: {
      operator: condition?.operator,
      value: condition?.value
    }
  })

  const operatorData = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' }
  ] as const

  useEffect(() => {
    const { operator, value } = form.values

    if (operator && value && form.isDirty()) {
      onChange?.({
        operator,
        value
      })
    }
  }, [form.values])

  return (
    <Group>
      <Select
        data={operatorData}
        onChange={v => v && form.setFieldValue('operator', v as any)}
      />
      <TextInput
        onInput={(e) => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
