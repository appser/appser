import { Group, NumberInput, Select } from '@appser/ui'
import { useForm } from '@appser/ui/form'
import { useEffect } from 'react'

import type { FieldFilterOperatorItemProps } from '..'
import type { FC } from 'react'

export const NumberFilterOperatorItem: FC<FieldFilterOperatorItemProps> = ({ field, onChange, defaultOperatorItem }) => {
  const form = useForm({
    initialValues: {
      type: defaultOperatorItem?.type,
      value: defaultOperatorItem?.value
    }
  })

  const data = [
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
        data={data}
        onChange={v => v && form.setFieldValue('type', v as any)}
      />
      <NumberInput
        onInput={(e) => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
