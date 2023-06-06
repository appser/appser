import { Group, MultiSelect, Select } from '@appser/ui'
import { useForm } from '@appser/ui/form'
import { useEffect, useMemo } from 'react'

import type { FieldFilterOperatorItemProps } from '..'
import type { FC } from 'react'

export const MultipleSelectFilterOperatorItem: FC<FieldFilterOperatorItemProps> = ({ field, onChange, defaultOperatorItem }) => {
  const form = useForm({
    initialValues: {
      type: defaultOperatorItem?.type,
      value: defaultOperatorItem?.value as string[] | undefined
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
    if (field.type !== 'multipleSelect') return []

    return field.options.items.map((item) => ({
      label: item.name,
      value: String(item.id)
    }))
  }, [field])

  useEffect(() => {
    const { type, value } = form.values

    if (type && value && form.isDirty()) {
      onChange?.({
        type,
        value
      })
    }
  }, [form.values])

  return (
    <Group spacing={0} noWrap>
      <Select
        w={100}
        data={operatorData}
        defaultValue={form.values.type}
        onChange={v => v && form.setFieldValue('type', v as any)}
      />

      <MultiSelect
        data={valueData}
        placeholder="Pick all that you like"
        defaultValue={Array.isArray(form.values.value) ? form.values.value.map(String) : undefined}
        clearable
        onChange={v => form.setFieldValue('value', v)}
      />
    </Group>
  )
}
