import { Group, NumberInput, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const NumberFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
  const form = useForm({
    initialValues: {
      operator: condition?.operator,
      value: condition?.value
    }
  })

  const operatorData = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' },
    { label: '大于', value: 'gt' },
    { label: '大于或等于', value: 'gte' },
    { label: '小于', value: 'lt' },
    { label: '小于或等于', value: 'lte' },
    { label: '为空', value: 'null' },
    { label: '不为空', value: 'notNull' }
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
    <Group spacing={0} noWrap>
      <Select
        w={100}
        data={operatorData}
        onChange={v => v && form.setFieldValue('operator', v as any)}
      />
      <NumberInput
        onInput={(e) => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
