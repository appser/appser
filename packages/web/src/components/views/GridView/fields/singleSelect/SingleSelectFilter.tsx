import { Group, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect, useMemo } from 'react'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const SingleSelectFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
  const form = useForm({
    initialValues: {
      operator: condition?.operator,
      value: condition?.value as number
    }
  })

  const operatorData = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' },
    { label: '包含', value: 'in' },
    { label: '不包含', value: 'nin' },
    { label: '为空', value: 'null' },
    { label: '不为空', value: 'notNull' }
  ] as const

  const valueData = useMemo(() => {
    if (column.field !== 'singleSelect') return []

    return column.options.items.map((item) => ({
      label: item.name,
      value: String(item.id)
    }))
  }, [column])

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

      <Select
        data={valueData}
        defaultValue={String(form.values.value)}
        onChange={v => v && form.setFieldValue('value', Number(v))}
        placeholder="Pick all that you like"
        clearable
      />
    </Group>
  )
}
