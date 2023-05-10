import { Group, Select, useForm } from '@appser/ui'
import { useEffect } from 'react'

import type { FieldFilterOperatorItemProps } from '..'
import type { FC } from 'react'

export const CheckboxFilterOperatorItem: FC<FieldFilterOperatorItemProps> = ({ onChange, defaultOperatorItem }) => {
  const form = useForm({
    initialValues: {
      type: defaultOperatorItem?.type ?? 'eq',
      value: defaultOperatorItem?.value
    }
  })

  const data = [
    { label: 'select ', value: 'true' },
    { label: 'unselected ', value: 'false' }
  ] as const

  useEffect(() => {
    if (form.values.type && form.values.value) {
      onChange?.(form.values)
    }
  }, [form.values])

  return (
    <Group spacing={0} noWrap>
      <Select
        w={100}
        defaultValue={String(form.values.value)}
        data={data}
        onChange={v => v && form.setFieldValue('value', Boolean(v))}
      />
    </Group>
  )
}
