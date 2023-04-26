import { Group, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const CheckboxFilter: FC<FieldFilterProps> = ({ onChange, condition }) => {
  const form = useForm({
    initialValues: {
      operator: condition?.operator ?? 'eq',
      value: condition?.value
    }
  })

  const valueData = [
    { label: 'select ', value: 'true' },
    { label: 'unselected ', value: 'false' }
  ] as const

  useEffect(() => {
    if (form.values.operator && form.values.value) {
      onChange?.(form.values)
    }
  }, [form.values])

  return (
    <Group spacing={0} noWrap>
      <Select
        w={100}
        defaultValue={String(form.values.value)}
        data={valueData}
        onChange={v => v && form.setFieldValue('value', Boolean(v))}
      />
    </Group>
  )
}
