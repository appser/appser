import { Group, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const NumIdFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
  const form = useForm({
    initialValues: {
      operator: condition?.operator,
      value: condition?.value
    }
  })

  return (
    <Group>
      <Select
        onChange={v => v && form.setFieldValue('operator', v)}
        data={[{ value: 'eq', label: '=' }]}
      />
      <TextInput />
    </Group>
  )
}
