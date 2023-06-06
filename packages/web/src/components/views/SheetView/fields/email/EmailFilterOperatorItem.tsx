import { Group, Select, TextInput } from '@appser/ui'
import { useForm } from '@appser/ui/form'
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
    { label: '不等于', value: 'neq' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'notLike' },
    { label: '为空', value: 'null' },
    { label: '不为空', value: 'notNull' }
  ] as const

  useEffect(() => {
    const { type, value } = form.values

    if (type && value) {
      onChange?.({
        type,
        value: type === 'null' || type === 'notNull' ? true : value
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
      {form.values.type === 'null' || form.values.type === 'notNull'
        ? null
        : <TextInput
            defaultValue={form.values.value ? String(form.values.value) : undefined}
            onInput={(e) => form.setFieldValue('value', e.currentTarget.value)}
          />}
    </Group>
  )
}
