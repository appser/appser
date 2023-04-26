import { Group, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const URLFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
  const form = useForm({
    initialValues: {
      operator: condition?.operator,
      value: condition?.value
    }
  })

  const operatorData = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'notLike' }
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
      <TextInput
        onInput={e => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
