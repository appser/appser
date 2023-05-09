import { Group, Select, TextInput, useForm } from '@appser/ui'
import { useEffect } from 'react'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'
import type { FilterConditionOperator } from 'web/servers/dataset/useQueryRecord'

export const EmailFilter: FC<FieldFilterProps> = ({ onChange, condition }) => {
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

    if (operator && value) {
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
        defaultValue={form.values.operator}
        onChange={v => v && form.setFieldValue('operator', v as FilterConditionOperator)}
        data={operatorData}
      />
      <TextInput
        defaultValue={String(form.values.value)}
        onInput={(e) => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
