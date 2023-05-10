import { Group, Select, TextInput, useForm } from '@appser/ui'
import { useEffect } from 'react'

import type { FieldFilterOperatorItemProps } from '..'
import type { FC } from 'react'
import type { FilterConditionOperatorType } from 'web/types'

export const EmailFilterOperatorItem: FC<FieldFilterOperatorItemProps> = ({ onChange, defaultOperatorItem }) => {
  const form = useForm({
    initialValues: {
      type: defaultOperatorItem?.type,
      value: defaultOperatorItem?.value
    }
  })

  const operatorData = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' }
  ] as const

  useEffect(() => {
    const { type, value } = form.values

    if (type && value) {
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
        defaultValue={form.values.type}
        onChange={v => v && form.setFieldValue('type', v as FilterConditionOperatorType)}
        data={operatorData}
      />
      <TextInput
        defaultValue={String(form.values.value)}
        onInput={(e) => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
