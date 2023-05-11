import { Group, Select, TextInput } from '@appser/ui'
import { useForm } from '@appser/ui/form'
import { useEffect } from 'react'

import type { FieldFilterOperatorItemProps } from '..'
import type { FC } from 'react'

export const URLFilterOperatorItem: FC<FieldFilterOperatorItemProps> = ({ field, onChange, defaultOperatorItem }) => {
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
    { label: '不包含', value: 'notLike' }
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
        data={operatorData}
        onChange={v => v && form.setFieldValue('type', v as any)}
      />
      <TextInput
        onInput={e => form.setFieldValue('value', e.currentTarget.value)}
      />
    </Group>
  )
}
