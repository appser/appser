import { Group, Select, useForm } from '@appser/ui'
import { useEffect, useMemo } from 'react'

import type { FieldFilterOperatorItemProps } from '..'
import type { FC } from 'react'

export const SingleSelectFilterOperatorItem: FC<FieldFilterOperatorItemProps> = ({ field, onChange, defaultOperatorItem }) => {
  const form = useForm({
    initialValues: {
      type: defaultOperatorItem?.type,
      value: defaultOperatorItem?.value as number
    }
  })

  const data = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' },
    { label: '包含', value: 'in' },
    { label: '不包含', value: 'nin' },
    { label: '为空', value: 'null' },
    { label: '不为空', value: 'notNull' }
  ] as const

  const valueData = useMemo(() => {
    if (field.type !== 'singleSelect') return []

    return field.options.items.map((item) => ({
      label: item.name,
      value: String(item.id)
    }))
  }, [field])

  useEffect(() => {
    const { type: operator, value } = form.values

    if (operator && value && form.isDirty()) {
      onChange?.({
        type: operator,
        value
      })
    }
  }, [form.values])

  return (
    <Group spacing={0} noWrap>
      <Select
        w={100}
        data={data}
        onChange={v => v && form.setFieldValue('type', v as any)}
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
