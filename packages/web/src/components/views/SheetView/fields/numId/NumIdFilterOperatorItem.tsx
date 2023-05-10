import { Group, NumberInput, Select, TextInput, useForm } from '@appser/ui'
import { useEffect } from 'react'

import type { FieldFilterOperatorItemProps } from '..'
import type { FC } from 'react'

export const NumIdFilterOperatorItem: FC<FieldFilterOperatorItemProps> = ({ field, onChange, defaultOperatorItem }) => {
  const form = useForm({
    initialValues: {
      type: defaultOperatorItem?.type,
      value: defaultOperatorItem?.value
    }
  })

  const data = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' }
  ] as const

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
    <Group>
      <Select
        data={data}
        onChange={v => v && form.setFieldValue('type', v as any)}
      />
      <TextInput
        onInput={(e) => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
